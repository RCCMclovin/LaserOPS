import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  // Estados
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
        senha: senha
      });

      // 2. Login validade,  recebe o Token JWT e o Role do usuário
      const token = resposta.data.token;
      const userRole = resposta.data.role; 

      // 3. Salva o Token e a Role
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', userRole);

      alert('Login feito com sucesso!');
      
      // 4. Aqui você redirecionaria o usuário para a Dashboard
      // window.location.href = '/dashboard';

    } catch (error) {
      // Caso o back-end retorne erro (senha errada, usuário não existe)
      setErro(error.response?.data?.mensagem || 'Erro ao tentar fazer login.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc' }}>
      <h2>Acessar o Sistema</h2>
      
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
    </div>
  );
}

export default Login;