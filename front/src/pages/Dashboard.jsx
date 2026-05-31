import React, { useState, useEffect } from 'react';

function Dashboard() {
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');

  //Roda assim que a página carrega, buscando os dados salvos no login
  useEffect(() => {
    // Buscando as informações do localStorage (salvo em Login.csx)
    // Se não houver nada, definir como 'Client' para testes
    const role = localStorage.getItem('userRole') || 'Admin'; 
    const name = localStorage.getItem('userName') || 'Jogador';

    setUserRole(role);
    setUserName(name);
  }, []);

  // Função para simular o Logout
  const handleLogout = () => {
    localStorage.clear();
    window.location.reload(); // Recarrega a página para limpar o estado
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      
      {/* Cabeçalho do Dashboard */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #333', paddingBottom: '10px' }}>
        <div>
          <h1>LaserOps Central</h1>
          <p>Bem-vindo, <strong>{userName}</strong>! Seu nível de acesso é: <span style={{ color: '#007bff' }}>{userRole}</span></p>
        </div>
        <button onClick={handleLogout} style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Sair do Sistema
        </button>
      </header>

      {/* Conteúdo Principal */}
      <main style={{ marginTop: '30px' }}>
        <h2>Painel de Controle de LaserTag</h2>
        <p>Abaixo estão as operações disponíveis para o seu perfil:</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
          
          {/* ================= SEÇÃO DO CLIENT / JOGADOR ================= */}
          {userRole === 'Client' && (
            <>
              <div style={cardStyle}>
                <h3>🎮 Entrar em uma Partida</h3>
                <p>Busque arenas ativas na sua região e digite o código da sala para se conectar ao colete laser.</p>
                <button style={buttonStyle}>Buscar Partidas</button>
              </div>

              <div style={cardStyle}>
                <h3>🏪 Tornar-se uma Arena (Store)</h3>
                <p>Quer gerenciar seus próprios jogos e equipamentos? Envie uma solicitação para se tornar uma loja parceira.</p>
                <button style={{ ...buttonStyle, backgroundColor: '#28a745' }}>Solicitar Upgrade</button>
              </div>
            </>
          )}

          {/* ================= SEÇÃO DA STORE / ARENA ================= */}
          {userRole === 'Store' && (
            <>
              <div style={cardStyle}>
                <h3>⚡ Criar Nova Partida</h3>
                <p>Configure o modo de jogo (Team Deathmatch, Capture a Bandeira), limite de tempo e registre os coletes.</p>
                <button style={{ ...buttonStyle, backgroundColor: '#17a2b8' }}>Nova Partida</button>
              </div>

              <div style={cardStyle}>
                <h3>📋 Gerenciar Partidas</h3>
                <p>Visualize o placar em tempo real, encerre jogos em andamento e veja o histórico de pontuações.</p>
                <button style={buttonStyle}>Acessar Painel da Loja</button>
              </div>
            </>
          )}

          {/* ================= SEÇÃO DO ADMIN ================= */}
          {userRole === 'Admin' && (
            <>
              <div style={{ ...cardStyle, gridColumn: '1 / -1', borderColor: '#dc3545' }}>
                <h3 style={{ color: '#dc3545' }}>🛡️ Visão Geral do Administrador</h3>
                <p>Área restrita para manutenção do ecossistema LaserOps.</p>
                
                <div style={{ border: '1px solid #ddd', padding: '15px', marginTop: '15px', borderRadius: '4px', backgroundColor: '#f8f9fa' }}>
                  <h4>Pendências: Solicitações de Upgrade (Client ➜ Store)</h4>
                  <p style={{ fontSize: '14px', color: '#666' }}>Há 2 novos clientes aguardando aprovação para registrar suas arenas comerciais.</p>
                  <button style={{ ...buttonStyle, backgroundColor: '#dc3545', width: 'auto', padding: '10px 20px' }}>
                    Analisar Solicitações
                  </button>
                </div>
              </div>
            </>
          )}

        </div>
      </main>
    </div>
  );
}

// Estilos rápidos em objetos para não precisarmos focar em CSS agora
const cardStyle = {
  border: '1px solid #ddd',
  padding: '20px',
  borderRadius: '8px',
  backgroundColor: '#fff',
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
};

const buttonStyle = {
  width: '100%',
  padding: '10px',
  marginTop: '15px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  fontWeight: 'bold',
  cursor: 'pointer'
};

export default Dashboard;