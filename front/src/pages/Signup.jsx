import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    try {
      await axios.post('http://localhost:3334/v1/auth/signup', {
        name: name,
        email: email,
        password: password
      });

      setSucesso('Conta criada com sucesso! Redirecionando para o login...');
      
      // Aguarda 2 segundos e redireciona
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      console.error("Erro no cadastro:", error);
      setErro(error.response?.data?.mensagem || 'Erro ao tentar criar conta. Tente novamente.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', fontFamily: 'Arial, sans-serif' }}>
      <h2>LaserOps - Criar Conta</h2>
      
      {erro && <p style={{ color: 'red', fontWeight: 'bold' }}>{erro}</p>}
      {sucesso && <p style={{ color: 'green', fontWeight: 'bold' }}>{sucesso}</p>}

      <form onSubmit={handleSignup}>
        <div style={{ marginBottom: '10px' }}>
          <label>Nome de Jogador (ou Arena):</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>E-mail:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Senha:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}
          />
        </div>

        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
          Cadastrar e Jogar
        </button>
      </form>

      <button 
        onClick={() => navigate('/')} 
        style={{ width: '100%', padding: '10px', marginTop: '10px', backgroundColor: 'transparent', color: '#007bff', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
      >
        Já tenho uma conta. Fazer Login
      </button>
    </div>
  );
}

export default Signup;