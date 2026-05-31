import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate(); //Inicializa o redirecionador

  // States  
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault(); // Impede a página de recarregar
    setErro('');

    try {
      // 1. Envia dados para Back-end (Checar porta)
      const resposta = await axios.post('http://localhost:3334/v1/auth/login', {
        email: email,
        password: senha
      },{
        withCredentials: true
      });

      alert('Login feito com sucesso!');
      navigate('/dashboard');

    } catch (error) {
      // Caso o back-end retorne erro (senha errada, usuário não existe)
      setErro(error.response?.data?.mensagem || 'Erro ao tentar fazer login.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc' }}>
      <h2>Acessar LaserOPS</h2>
      
      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '10px' }}>
          <label>E-mail:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Senha:</label>
          <input 
            type="password" 
            value={senha} 
            onChange={(e) => setSenha(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none' }}>
          Entrar
        </button>
      </form>

      <div style={{ marginTop: '20px', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '15px' }}>
        <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>Novo na arena?</p>
        <button 
          onClick={() => navigate('/signup')} 
          style={{ width: '100%', padding: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Criar uma Conta
        </button>
      </div>
    </div>
  );
}

export default Login;