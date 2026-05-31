import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo';
import { api, getApiError } from '../services/api';

const passwordRules = [
  { label: '8+ caracteres', test: (value) => value.length >= 8 },
  { label: 'maiúscula', test: (value) => /[A-Z]/.test(value) },
  { label: 'minúscula', test: (value) => /[a-z]/.test(value) },
  { label: 'número', test: (value) => /\d/.test(value) },
  { label: 'símbolo', test: (value) => /[!@#$%^&*(),.?":{}|<>\[\]\\/`~;'_+=-]/.test(value) },
];

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailStatus, setEmailStatus] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(false);

  const allRulesOk = useMemo(() => passwordRules.every((rule) => rule.test(password)), [password]);

  const validarEmail = async () => {
    if (!email || !email.includes('@')) {
      setEmailStatus('');
      return;
    }

    try {
      const { data: exists } = await api.get(`/user/checkemail/${encodeURIComponent(email)}`);
      setEmailStatus(exists ? 'Este e-mail já está cadastrado.' : 'E-mail disponível.');
    } catch {
      setEmailStatus('Não foi possível verificar o e-mail agora.');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    if (!allRulesOk) {
      setErro('A senha precisa cumprir todas as regras de segurança.');
      return;
    }

    setCarregando(true);

    try {
      await api.post('/auth/signup', {
        name,
        email,
        password,
      });

      setSucesso('Conta criada. Redirecionando para o painel...');
      window.setTimeout(() => navigate('/dashboard'), 800);
    } catch (error) {
      setErro(getApiError(error, 'Erro ao criar conta. Verifique os dados e tente novamente.'));
    } finally {
      setCarregando(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card signup-card" aria-labelledby="signup-title">
        <BrandLogo />

        <div className="auth-copy">
          <p className="eyebrow">Novo jogador</p>
          <h1 id="signup-title">Criar conta</h1>
          <p className="muted">
            O cadastro começa como participante. Depois, você pode solicitar perfil de organizador.
          </p>
        </div>

        {erro && <div className="alert alert-error">{erro}</div>}
        {sucesso && <div className="alert alert-success">{sucesso}</div>}

        <form className="form-stack" onSubmit={handleSignup}>
          <label>
            <span>Nome</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex.: Arena Norte"
              autoComplete="name"
              required
            />
          </label>

          <label>
            <span>E-mail</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={validarEmail}
              placeholder="voce@email.com"
              autoComplete="email"
              required
            />
            {emailStatus && (
              <small className={emailStatus.includes('disponível') ? 'field-ok' : 'field-warning'}>
                {emailStatus}
              </small>
            )}
          </label>

          <label>
            <span>Senha</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Use uma senha forte"
              autoComplete="new-password"
              required
            />
          </label>

          <div className="password-rules" aria-label="Regras da senha">
            {passwordRules.map((rule) => (
              <span key={rule.label} className={rule.test(password) ? 'rule-ok' : ''}>
                {rule.label}
              </span>
            ))}
          </div>

          <button className="btn btn-primary" type="submit" disabled={carregando}>
            {carregando ? 'Criando...' : 'Cadastrar'}
          </button>
        </form>

        <div className="auth-footer">
          <span>Já tem conta?</span>
          <Link to="/">Fazer login</Link>
        </div>
      </section>
    </main>
  );
}

export default Signup;
