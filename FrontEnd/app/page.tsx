'use client';

import { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export default function Page() {
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupMessage, setSignupMessage] = useState('');
  const [signupError, setSignupError] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const [loginError, setLoginError] = useState('');

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 6)
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10)
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const isValidPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    return digits.length === 10 || digits.length === 11;
  };

  return (
    <main className="home">
      <div className="home-shell">
        <header className="home-nav">
          <div className="logo">
            <span className="logo-mark">◻︎</span>
            Precifica Brechó
          </div>
          <nav className="menu">
            <a href="#sobre">Sobre</a>
            <a href="#beneficios">Benefícios</a>
            <button
              type="button"
              className="menu-login"
              onClick={() => setIsLoginOpen(true)}
            >
              Entrar
            </button>
          </nav>
        </header>

        <section className="hero">
          <div className="hero-copy">
            <span className="tag">Precificação inteligente</span>
            <h1>Seu brechó com preços justos, margem clara e cadastro rápido.</h1>
            <p>
              Centralize dados, estime lucro e organize o catálogo com um painel
              simples. Feito para quem quer vender bem sem perder tempo.
            </p>
            <div className="hero-actions">
              <button type="button" onClick={() => setIsSignupOpen(true)}>
                Criar conta
              </button>
              <button type="button" className="secondary">
                Acessar painel
              </button>
            </div>
          </div>
        </section>

        <section id="beneficios" className="home-grid">
          <article className="home-card">
            <h3>Lucro sob controle</h3>
            <p>Veja margem por peça e entenda o impacto de cada ajuste.</p>
          </article>
          <article className="home-card">
            <h3>Cadastro sem fricção</h3>
            <p>Campos diretos e sugestões automáticas para ganhar tempo.</p>
          </article>
          <article className="home-card">
            <h3>Catálogo organizado</h3>
            <p>Filtros prontos para acompanhar estoque e performance.</p>
          </article>
        </section>

        <footer className="home-footer">
          <span>© 2026 Precifica Brechó</span>
          <div className="footer-links">
            <a href="/terms">Termos de uso</a>
            <a href="/privacy">Política de privacidade</a>
          </div>
        </footer>
      </div>

      {isSignupOpen && (
        <div className="modal-backdrop" onClick={() => setIsSignupOpen(false)}>
          <div className="modal modal--small" onClick={(event) => event.stopPropagation()}>
            <header className="modal-header">
              <div>
                <span className="tag">Cadastro</span>
                <h2>Crie sua conta</h2>
              </div>
              <button
                type="button"
                className="secondary"
                onClick={() => setIsSignupOpen(false)}
              >
                Fechar
              </button>
            </header>
            <form
              className="signup-form"
              onSubmit={async (event) => {
                event.preventDefault();
                setSignupMessage('');
                setSignupError('');
                if (!isValidPhone(phone)) {
                  setPhoneError('Informe um telefone válido com DDD.');
                  return;
                }
                if (!signupName.trim() || !signupEmail.trim() || !signupPassword) {
                  setSignupError('Preencha nome, email e senha.');
                  return;
                }
                setPhoneError('');
                try {
                  const response = await fetch(`${API_URL}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      name: signupName.trim(),
                      email: signupEmail.trim(),
                      phone: phone.trim(),
                      password: signupPassword,
                    }),
                  });
                  if (!response.ok) {
                    const text = await response.text();
                    throw new Error(text || 'Erro ao cadastrar.');
                  }
                  const data = (await response.json()) as { token?: string };
                  if (data?.token) {
                    localStorage.setItem('auth_token', data.token);
                  }
                  setSignupMessage('Cadastro realizado com sucesso.');
                  window.location.href = '/admin';
                } catch (error) {
                  setSignupError(
                    error instanceof Error ? error.message : 'Erro ao cadastrar.',
                  );
                }
              }}
            >
              <div className="field">
                <label htmlFor="signup-name">Nome</label>
                <input
                  id="signup-name"
                  placeholder="Seu nome completo"
                  value={signupName}
                  onChange={(event) => setSignupName(event.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="signup-email">Email</label>
                <input
                  id="signup-email"
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  value={signupEmail}
                  onChange={(event) => setSignupEmail(event.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="signup-password">Senha</label>
                <input
                  id="signup-password"
                  type="password"
                  placeholder="Crie uma senha"
                  value={signupPassword}
                  onChange={(event) => setSignupPassword(event.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="signup-phone">Telefone</label>
                <input
                  id="signup-phone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={phone}
                  onChange={(event) => {
                    setPhone(formatPhone(event.target.value));
                    if (phoneError) setPhoneError('');
                  }}
                />
                {phoneError && <span className="field-error">{phoneError}</span>}
              </div>
              {signupError && <div className="form-message error">{signupError}</div>}
              {signupMessage && (
                <div className="form-message success">{signupMessage}</div>
              )}
              <button type="submit">Cadastrar</button>
            </form>
          </div>
        </div>
      )}

      {isLoginOpen && (
        <div className="modal-backdrop" onClick={() => setIsLoginOpen(false)}>
          <div className="modal modal--small" onClick={(event) => event.stopPropagation()}>
            <header className="modal-header">
              <div>
                <span className="tag">Acesso</span>
                <h2>Entrar</h2>
              </div>
              <button
                type="button"
                className="secondary"
                onClick={() => setIsLoginOpen(false)}
              >
                Fechar
              </button>
            </header>
            <form
              className="signup-form"
              onSubmit={async (event) => {
                event.preventDefault();
                setLoginMessage('');
                setLoginError('');
                if (!loginEmail.trim() || !loginPassword) {
                  setLoginError('Informe email e senha.');
                  return;
                }
                try {
                  const response = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      email: loginEmail.trim(),
                      password: loginPassword,
                    }),
                  });
                  if (!response.ok) {
                    const text = await response.text();
                    throw new Error(text || 'Erro ao entrar.');
                  }
                  const data = (await response.json()) as { token?: string };
                  if (data?.token) {
                    localStorage.setItem('auth_token', data.token);
                  }
                  setLoginMessage('Login realizado com sucesso.');
                  window.location.href = '/admin';
                } catch (error) {
                  setLoginError(
                    error instanceof Error ? error.message : 'Erro ao entrar.',
                  );
                }
              }}
            >
              <div className="field">
                <label htmlFor="login-email">Email</label>
                <input
                  id="login-email"
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  value={loginEmail}
                  onChange={(event) => setLoginEmail(event.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="login-password">Senha</label>
                <input
                  id="login-password"
                  type="password"
                  placeholder="Sua senha"
                  value={loginPassword}
                  onChange={(event) => setLoginPassword(event.target.value)}
                />
              </div>
              {loginError && <div className="form-message error">{loginError}</div>}
              {loginMessage && (
                <div className="form-message success">{loginMessage}</div>
              )}
              <button type="submit">Entrar</button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
