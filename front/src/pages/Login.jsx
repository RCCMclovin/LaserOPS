import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo';
import { api, getApiError } from '../services/api';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      await api.post('/auth/login', {
        email,
        password: senha,
      });
      navigate('/dashboard');
    } catch (error) {
      setErro(getApiError(error, 'E-mail ou senha inválidos.'));
    } finally {
      setCarregando(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="login-title">
        <BrandLogo />

        <div className="auth-copy">
          <p className="eyebrow">Acesso seguro</p>
          <h1 id="login-title">Entrar na arena</h1>
          <p className="muted">
            Faça login para participar, organizar partidas ou administrar o LaserOps.
          </p>
        </div>

        {erro && <div className="alert alert-error">{erro}</div>}

        <form className="form-stack" onSubmit={handleLogin}>
          <label>
            <span>E-mail</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@email.com"
              autoComplete="email"
              required
            />
          </label>

          <label>
            <span>Senha</span>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Sua senha"
              autoComplete="current-password"
              required
            />
          </label>

          <button className="btn btn-primary" type="submit" disabled={carregando}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="auth-footer">
          <span>Novo no jogo?</span>
          <Link to="/signup">Criar conta</Link>
        </div>
      </section>
    </main>
  );
}

export default Login;
