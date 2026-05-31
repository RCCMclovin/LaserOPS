import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');
  //Deixa a página no estado de carregando até pegarmos o role
  const [carregando, setCarregando] = useState(true); 
  const navigate = useNavigate();

  // Rodaquando a pessoa entra na página
  useEffect(() => {
    const verificarUsuarioLogado = async () => {
      try {
        // Pega o nome e role do usuário
        const resposta = await axios.get('http://localhost:3334/v1/user/chkrole', { 
          withCredentials: true 
        });
        setUserName(resposta.data.name);
        setUserRole(resposta.data.role); 
        setCarregando(false); // Já temos os dados, pode liberar a tela!

      } catch (error) {
        console.error("Erro ao validar sessão:", error);
        // Caso  de erro, manda de volta pro Login
        navigate('/');
      }
    };

    verificarUsuarioLogado();
  }, [navigate]);

  // Função de Logout modificada
  const handleLogout = async () => {
    try {
      // Opcional: Avisar o back-end para derrubar a sessão lá também
      await axios.post('http://localhost:3334/v1/auth/logout', {}, { withCredentials: true });
    } catch (err) {
      console.log("Erro ao deslogar no servidor, limpando local...");
    }
    navigate('/');
  };

  // Enquanto o servidor não responde, mostra uma tela neutra
  if (carregando) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h2>Carregando sistema LaserOps...</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #333', paddingBottom: '10px' }}>
        <div>
          <h1>LaserOps Central</h1>
          <p>Bem-vindo, <strong>{userName}</strong>! Seu nível de acesso é: <span style={{ color: '#007bff' }}>{userRole}</span></p>
        </div>
        <button onClick={handleLogout} style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Sair do Sistema
        </button>
      </header>

      <main style={{ marginTop: '30px' }}>
        <h2>Painel de Controle de LaserTag</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
          {/* SEÇÃO DO CLIENT */}
          {userRole === 'Client' && (
            <>
              <div style={cardStyle}>
                <h3>🎮 Entrar em uma Partida</h3>
                <p>Busque arenas ativas na sua região e digite o código da sala.</p>
                <button style={buttonStyle}>Buscar Partidas</button>
              </div>
              <div style={cardStyle}>
                <h3>🏪 Tornar-se uma Arena (Store)</h3>
                <p>Envie uma solicitação para se tornar uma loja parceira.</p>
                <button style={{ ...buttonStyle, backgroundColor: '#28a745' }}>Solicitar Upgrade</button>
              </div>
            </>
          )}

          {/* SEÇÃO DA STORE */}
          {userRole === 'Store' && (
            <>
              <div style={cardStyle}>
                <h3>⚡ Criar Nova Partida</h3>
                <p>Configure o modo de jogo e registre os coletes.</p>
                <button style={{ ...buttonStyle, backgroundColor: '#17a2b8' }}>Nova Partida</button>
              </div>
              <div style={cardStyle}>
                <h3>📋 Gerenciar Partidas</h3>
                <p>Visualize o placar em tempo real.</p>
                <button style={buttonStyle}>Acessar Painel da Loja</button>
              </div>
            </>
          )}

          {/* SEÇÃO DO ADMIN */}
          {userRole === 'Admin' && (
            <div style={{ ...cardStyle, gridColumn: '1 / -1', borderColor: '#dc3545' }}>
              <h3 style={{ color: '#dc3545' }}>🛡️ Visão Geral do Administrador</h3>
              <div style={{ border: '1px solid #ddd', padding: '15px', marginTop: '15px', borderRadius: '4px', backgroundColor: '#f8f9fa' }}>
                <h4>Pendências: Solicitações de Upgrade (Client ➜ Store)</h4>
                <button style={{ ...buttonStyle, backgroundColor: '#dc3545', width: 'auto' }}>Analisar Solicitações</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const cardStyle = { border: '1px solid #ddd', padding: '20px', borderRadius: '8px', backgroundColor: '#fff' };
const buttonStyle = { width: '100%', padding: '10px', marginTop: '15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' };

export default Dashboard;