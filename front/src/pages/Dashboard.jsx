import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo';
import { api, getApiError } from '../services/api';

const roleLabels = {
  client: 'Participante (usuário comum)',
  store: 'Organizador',
  admin: 'Administrador',
};

const participationLabels = {
  spectator: 'espectador',
  player: 'jogador',
};

function normalizeParticipationRole(value) {
  if (!value) return '';
  const role = String(value).toLowerCase();
  if (role === 'spectator') return 'spectator';
  if (role === 'player') return 'player';
  return role;
}

function formatDate(value) {
  if (!value) return 'Data não informada';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
}

function toDateTimeLocal(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const offsetMs = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

function uniqueEvents(publicEvents, managedEvents) {
  const map = new Map();
  [...publicEvents, ...managedEvents].forEach((event) => {
    if (event?.id) map.set(event.id, { ...map.get(event.id), ...event });
  });
  return Array.from(map.values()).sort((a, b) => new Date(b.date) - new Date(a.date));
}

function Dashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState({ id: '', name: '', role: '' });
  const [events, setEvents] = useState([]);
  const [managedEvents, setManagedEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState({});
  const [codes, setCodes] = useState({});
  const [newEvent, setNewEvent] = useState({ description: '', date: '' });
  const [editingEventId, setEditingEventId] = useState(null);
  const [editEvent, setEditEvent] = useState({ description: '', date: '' });
  const [requestText, setRequestText] = useState('Gostaria de organizar eventos no LaserOps.');
  const [adminRequests, setAdminRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);

  const roleLabel = useMemo(() => roleLabels[session.role] || 'Usuário', [session.role]);
  const canManageEvents = session.role === 'store' || session.role === 'admin';
  const visibleEvents = useMemo(() => uniqueEvents(events, managedEvents), [events, managedEvents]);
  const pendingRequests = useMemo(
    () => adminRequests.filter((request) => String(request.status).toLowerCase() === 'pending'),
    [adminRequests],
  );

  const showNotice = (type, message) => {
    setNotice({ type, message });
    window.clearTimeout(showNotice.timeoutId);
    showNotice.timeoutId = window.setTimeout(() => setNotice(null), 4500);
  };

  const loadSession = async () => {
    const { data } = await api.get('/user/chkrole');
    setSession(data);
    return data;
  };

  const loadEvents = async () => {
    const { data } = await api.get('/event');
    setEvents(Array.isArray(data) ? data : []);
  };

  const loadManagedEvents = async (currentSession = session) => {
    if (!currentSession.id || !['store', 'admin'].includes(currentSession.role)) {
      setManagedEvents([]);
      return;
    }

    const { data } = await api.get(`/event/${currentSession.id}`);
    setManagedEvents(Array.isArray(data) ? data : []);
  };

  const loadMyParticipations = async () => {
    const { data } = await api.get('/participant/me');
    const participants = Array.isArray(data) ? data : [];
    const mine = participants.reduce((acc, participant) => {
      acc[participant.eventId] = {
        role: normalizeParticipationRole(participant.role),
      };
      return acc;
    }, {});

    setJoinedEvents(mine);
  };

  const loadAdminRequests = async (currentSession = session) => {
    if (currentSession.role !== 'admin') {
      setAdminRequests([]);
      return;
    }

    const { data } = await api.get('/request');
    setAdminRequests(Array.isArray(data) ? data : []);
  };

  const reloadDashboardData = async (currentSession = session) => {
    await Promise.all([
      loadEvents(),
      loadManagedEvents(currentSession),
      loadMyParticipations(),
      loadAdminRequests(currentSession),
    ]);
  };

  const bootstrap = async () => {
    try {
      setLoading(true);
      const currentSession = await loadSession();
      await reloadDashboardData(currentSession);
    } catch (error) {
      console.error('Sessão inválida:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    bootstrap();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.warn('Erro ao encerrar sessão:', error);
    } finally {
      navigate('/');
    }
  };

  const handleRefresh = async () => {
    setBusy(true);
    try {
      await reloadDashboardData(session);
      showNotice('success', 'Dashboard atualizado.');
    } catch (error) {
      showNotice('error', getApiError(error, 'Não foi possível atualizar o dashboard.'));
    } finally {
      setBusy(false);
    }
  };

  const handleSpectator = async (event) => {
    setBusy(true);
    try {
      await api.post(`/participant/${event.id}`);
      await loadMyParticipations();
      showNotice('success', 'Você entrou como espectador.');
    } catch (error) {
      showNotice('error', getApiError(error, 'Não foi possível entrar como espectador.'));
    } finally {
      setBusy(false);
    }
  };

  const handlePlayer = async (event) => {
    const code = codes[event.id]?.trim();
    if (!code) {
      showNotice('error', 'Informe o código da arena para entrar como jogador.');
      return;
    }

    setBusy(true);
    try {
      await api.post(`/participant/${event.id}/${encodeURIComponent(code)}`);
      await loadMyParticipations();
      setCodes((current) => ({ ...current, [event.id]: '' }));
      showNotice('success', 'Você entrou como jogador.');
    } catch (error) {
      showNotice('error', getApiError(error, 'Código inválido ou participação não permitida.'));
    } finally {
      setBusy(false);
    }
  };

  const handleLeave = async (eventId) => {
    setBusy(true);
    try {
      await api.delete(`/participant/${eventId}`);
      await loadMyParticipations();
      showNotice('success', 'Participação cancelada.');
    } catch (error) {
      showNotice('error', getApiError(error, 'Não foi possível cancelar a participação.'));
    } finally {
      setBusy(false);
    }
  };

  const handleUpgradeRequest = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post('/request', { text: requestText });
      showNotice('success', 'Solicitação enviada para o administrador.');
    } catch (error) {
      showNotice('error', getApiError(error, 'Não foi possível enviar a solicitação.'));
    } finally {
      setBusy(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post('/event', newEvent);
      setNewEvent({ description: '', date: '' });
      await reloadDashboardData(session);
      showNotice('success', 'Evento criado. Use Publicar para aparecer na lista pública.');
    } catch (error) {
      showNotice('error', getApiError(error, 'Não foi possível criar o evento.'));
    } finally {
      setBusy(false);
    }
  };

  const handleTogglePublish = async (eventId) => {
    setBusy(true);
    try {
      await api.post(`/event/publish/${eventId}`);
      await reloadDashboardData(session);
      showNotice('success', 'Status de publicação atualizado.');
    } catch (error) {
      showNotice('error', getApiError(error, 'Não foi possível alterar a publicação.'));
    } finally {
      setBusy(false);
    }
  };

  const startEditEvent = (event) => {
    setEditingEventId(event.id);
    setEditEvent({
      description: event.description || '',
      date: toDateTimeLocal(event.date),
    });
  };

  const cancelEditEvent = () => {
    setEditingEventId(null);
    setEditEvent({ description: '', date: '' });
  };

  const handleUpdateEvent = async (e, eventId) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.put(`/event/${eventId}`, editEvent);
      cancelEditEvent();
      await reloadDashboardData(session);
      showNotice('success', 'Evento atualizado.');
    } catch (error) {
      showNotice('error', getApiError(error, 'Não foi possível editar o evento.'));
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    const confirmed = window.confirm('Remover este evento? Essa ação também removerá a referência dele na listagem.');
    if (!confirmed) return;

    setBusy(true);
    try {
      await api.delete(`/event/${eventId}`);
      await reloadDashboardData(session);
      showNotice('success', 'Evento removido.');
    } catch (error) {
      showNotice('error', getApiError(error, 'Não foi possível remover o evento.'));
    } finally {
      setBusy(false);
    }
  };

  const handleRequestDecision = async (requestId, decision) => {
    setBusy(true);
    try {
      await api.post(`/request/${decision}/${requestId}`);
      await loadAdminRequests(session);
      showNotice('success', decision === 'accept' ? 'Solicitação aceita.' : 'Solicitação recusada.');
    } catch (error) {
      showNotice('error', getApiError(error, 'Não foi possível responder à solicitação.'));
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <main className="dashboard-page loading-state">
        <div className="loader-ring" />
        <h2>Validando sessão...</h2>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <BrandLogo compact />
        <div className="header-copy">
          <p className="eyebrow">Dashboard</p>
          <h1>LaserOps</h1>
          <p className="muted">
            Login ativo para <strong>{session.name}</strong>. Perfil: <span className="role-pill">{roleLabel}</span>
          </p>
        </div>
        <button className="btn btn-ghost" type="button" onClick={handleLogout}>Sair</button>
      </header>

      {notice && <div className={`alert alert-${notice.type}`}>{notice.message}</div>}

      <section className="summary-grid" aria-label="Resumo">
        <article className="summary-card pastel-blue">
          <span>Eventos visíveis</span>
          <strong>{visibleEvents.length}</strong>
        </article>
        <article className="summary-card pastel-pink">
          <span>Meu perfil</span>
          <strong>{roleLabel}</strong>
        </article>
        <article className="summary-card pastel-green">
          <span>Minhas inscrições</span>
          <strong>{Object.keys(joinedEvents).length}</strong>
        </article>
      </section>

      {canManageEvents && (
        <section className="panel manager-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Organizador</p>
              <h2>Criar evento</h2>
              <p className="muted">Crie uma partida e publique quando estiver pronta para receber participantes.</p>
            </div>
          </div>
          <form className="create-event-form" onSubmit={handleCreateEvent}>
            <label>
              <span>Descrição</span>
              <textarea
                value={newEvent.description}
                onChange={(e) => setNewEvent((current) => ({ ...current, description: e.target.value }))}
                placeholder="Ex.: Partida amistosa 5x5"
                minLength={3}
                maxLength={600}
                required
              />
            </label>
            <label>
              <span>Data e hora</span>
              <input
                type="datetime-local"
                value={newEvent.date}
                onChange={(e) => setNewEvent((current) => ({ ...current, date: e.target.value }))}
                required
              />
            </label>
            <button className="btn btn-primary" type="submit" disabled={busy}>Criar evento</button>
          </form>
        </section>
      )}

      {session.role === 'admin' && (
        <section className="panel admin-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Administração</p>
              <h2>Pedidos para virar organizador</h2>
              <p className="muted">Aprove ou recuse solicitações de participantes que querem criar eventos.</p>
            </div>
            <button className="btn btn-secondary" type="button" onClick={() => loadAdminRequests(session)} disabled={busy}>Atualizar pedidos</button>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="empty-state compact-empty">
              <h3>Nenhum pedido pendente</h3>
              <p>Quando um participante solicitar acesso de organizador, o pedido aparecerá aqui.</p>
            </div>
          ) : (
            <div className="request-list">
              {pendingRequests.map((request) => (
                <article className="request-card" key={request.id}>
                  <div>
                    <strong>{request.user?.name || 'Usuário sem nome'}</strong>
                    <p className="muted small-text">{request.user?.email || request.userId}</p>
                    <p>{request.text}</p>
                  </div>
                  <div className="request-actions">
                    <button className="btn btn-primary compact-btn" type="button" onClick={() => handleRequestDecision(request.id, 'accept')} disabled={busy}>Aceitar</button>
                    <button className="btn btn-ghost compact-btn" type="button" onClick={() => handleRequestDecision(request.id, 'refuse')} disabled={busy}>Recusar</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      <section className="panel events-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Eventos</p>
            <h2>Eventos disponíveis</h2>
            <p className="muted">
              A lista mostra o organizador, seu status de inscrição e as ações permitidas para seu perfil.
            </p>
          </div>
          <button className="btn btn-secondary" type="button" onClick={handleRefresh} disabled={busy}>Atualizar</button>
        </div>

        {visibleEvents.length === 0 ? (
          <div className="empty-state">
            <h3>Nenhum evento disponível</h3>
            <p>Quando um organizador publicar um evento, ele aparecerá nesta lista.</p>
          </div>
        ) : (
          <div className="event-list">
            {visibleEvents.map((event) => {
              const joined = joinedEvents[event.id];
              const joinedLabel = participationLabels[joined?.role] || joined?.role;
              const organizerName = event.creator?.name || event.creatorName || 'Organizador não informado';
              const isManager = session.role === 'admin' || event.creatorId === session.id;
              const isEditing = editingEventId === event.id;

              return (
                <article className={`event-card ${joined ? 'event-card-joined' : ''}`} key={event.id}>
                  <div className="event-main">
                    <div className="event-topline">
                      <span className="date-chip">{formatDate(event.date)}</span>
                      <span className={event.isPublished ? 'publish-chip published' : 'publish-chip draft'}>
                        {event.isPublished ? 'Publicado' : 'Rascunho'}
                      </span>
                      {joined && <span className="status-pill">Inscrito como {joinedLabel}</span>}
                    </div>

                    {isEditing ? (
                      <form className="edit-event-form" onSubmit={(e) => handleUpdateEvent(e, event.id)}>
                        <label>
                          <span>Descrição</span>
                          <textarea
                            value={editEvent.description}
                            onChange={(e) => setEditEvent((current) => ({ ...current, description: e.target.value }))}
                            minLength={3}
                            maxLength={600}
                            required
                          />
                        </label>
                        <label>
                          <span>Data e hora</span>
                          <input
                            type="datetime-local"
                            value={editEvent.date}
                            onChange={(e) => setEditEvent((current) => ({ ...current, date: e.target.value }))}
                            required
                          />
                        </label>
                        <div className="inline-actions">
                          <button className="btn btn-primary compact-btn" type="submit" disabled={busy}>Salvar</button>
                          <button className="btn btn-ghost compact-btn" type="button" onClick={cancelEditEvent} disabled={busy}>Cancelar</button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <h3>{event.description}</h3>
                        <p className="muted small-text">Organizador: <strong>{organizerName}</strong></p>
                        {event.code && isManager && <code className="event-code">Código para jogadores: {event.code}</code>}
                        <p className="muted small-text">
                          {joined
                            ? 'Sua inscrição neste evento foi encontrada no backend.'
                            : event.isPublished
                              ? 'Você ainda não está inscrito neste evento.'
                              : 'Evento ainda não publicado; apenas organizadores/admins podem gerenciar.'}
                        </p>
                      </>
                    )}
                  </div>

                  {!isEditing && (
                    <div className="event-actions-grid">
                      {event.isPublished && (
                        joined ? (
                          <button className="btn btn-ghost compact-btn" type="button" onClick={() => handleLeave(event.id)} disabled={busy}>
                            Desinscrever
                          </button>
                        ) : (
                          <>
                            <button className="btn btn-secondary" type="button" onClick={() => handleSpectator(event)} disabled={busy}>
                              Assistir como espectador
                            </button>
                            <div className="player-entry">
                              <input
                                type="text"
                                value={codes[event.id] || ''}
                                onChange={(e) => setCodes((current) => ({ ...current, [event.id]: e.target.value }))}
                                placeholder="Código para jogar"
                              />
                              <button className="btn btn-primary" type="button" onClick={() => handlePlayer(event)} disabled={busy}>
                                Entrar como jogador
                              </button>
                            </div>
                          </>
                        )
                      )}

                      {isManager && (
                        <div className="manager-actions">
                          <button className="btn btn-secondary compact-btn" type="button" onClick={() => startEditEvent(event)} disabled={busy}>Editar</button>
                          <button className="btn btn-secondary compact-btn" type="button" onClick={() => handleTogglePublish(event.id)} disabled={busy}>
                            {event.isPublished ? 'Despublicar' : 'Publicar'}
                          </button>
                          <button className="btn btn-danger compact-btn" type="button" onClick={() => handleDeleteEvent(event.id)} disabled={busy}>Remover</button>
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      {session.role === 'client' && (
        <section className="panel soft-panel upgrade-panel">
          <p className="eyebrow">Perfil</p>
          <h2>Virar organizador</h2>
          <p className="muted small-text">
            Participantes podem pedir acesso de organizador. A aprovação é feita por um administrador.
          </p>
          <form className="form-stack" onSubmit={handleUpgradeRequest}>
            <textarea
              value={requestText}
              onChange={(e) => setRequestText(e.target.value)}
              minLength={3}
              maxLength={600}
              required
            />
            <button className="btn btn-primary" type="submit" disabled={busy}>Enviar solicitação</button>
          </form>
        </section>
      )}
    </main>
  );
}

export default Dashboard;
