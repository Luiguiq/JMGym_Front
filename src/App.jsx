import { useState } from 'react';
import logoJmGym from './assets/logo-jmgym.jpeg';

const features = [
  {
    icon: '🏋️',
    title: 'Entrenamiento',
    text: 'Rutinas personalizadas para todos los niveles.',
  },
  {
    icon: '🧘',
    title: 'Bienestar',
    text: 'Espacios comodos y ambiente relajado.',
  },
];

const clientBenefits = [
  {
    icon: '💃',
    title: 'Clases variadas',
    text: 'Cardio, Zumba, Cuerpo Completo y mas',
  },
  {
    icon: '📍',
    title: 'Elige tu espacio',
    text: 'Mapa interactivo de salon',
  },
  {
    icon: '💳',
    title: 'Pago rapido',
    text: 'Yape, transferencia o efectivo',
  },
];

function App() {
  const [screen, setScreen] = useState('home');

  if (screen === 'client') {
    return <ClientWelcome onBack={() => setScreen('home')} onStart={() => setScreen('client-login')} />;
  }

  if (screen === 'client-login') {
    return <ClientLogin onBack={() => setScreen('client')} onCreateAccount={() => setScreen('client-register')} />;
  }

  if (screen === 'client-register') {
    return <ClientRegister onBack={() => setScreen('client-login')} onLogin={() => setScreen('client-login')} />;
  }

  return (
    <main className="home-page">
      <section className="hero-card" aria-label="Pantalla de inicio JMGym">
        <header className="brand-header">
          <img className="brand-logo" src={logoJmGym} alt="Logo de JMGym" />
          <strong>JMGym</strong>
        </header>

        <div className="hero-content">
          <div className="hero-intro">
            <p className="eyebrow">Splash screen principal</p>
            <h1>Rompe tus limites</h1>
            <p className="hero-description">
              Unete a una experiencia fitness moderna, simple y disenada para todas las edades.
            </p>
          </div>

          <div className="feature-grid" aria-label="Beneficios principales">
            {features.map((feature) => (
              <article className="feature-card" key={feature.title}>
                <div className="feature-icon" aria-hidden="true">{feature.icon}</div>
                <h2>{feature.title}</h2>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>

          <section className="access-card" aria-labelledby="access-title">
            <h2 id="access-title">Selecciona tu acceso</h2>
            <p>Ingresa segun tu perfil para acceder a las funciones correspondientes.</p>
            <div className="access-actions">
              <button className="primary-button" type="button" onClick={() => setScreen('client')}>
                👤 Ingresar como Cliente
              </button>
              <button className="secondary-button" type="button">🛠️ Ingresar como Administrador</button>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function ClientWelcome({ onBack, onStart }) {
  return (
    <main className="client-page">
      <section className="client-panel" aria-label="Bienvenida para cliente JMGym">
        <button className="back-button" type="button" onClick={onBack} aria-label="Volver al inicio">
          ←
        </button>

        <div className="client-hero">
          <img className="client-logo" src={logoJmGym} alt="Logo de JMGym" />
          <h1>Bienvenida a JMGym</h1>
          <p>
            Reserva tus clases de baile favoritas en segundos. Encuentra tu ritmo, elige tu
            espacio y a bailar!
          </p>
        </div>

        <div className="benefit-list" aria-label="Beneficios para clientes">
          {clientBenefits.map((benefit) => (
            <article className="benefit-item" key={benefit.title}>
              <div className="benefit-icon" aria-hidden="true">{benefit.icon}</div>
              <div>
                <h2>{benefit.title}</h2>
                <p>{benefit.text}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="client-actions">
          <button className="client-start-button" type="button" onClick={onStart}>Comenzar</button>
          <p>¿Ya tienes cuenta? <button type="button">Inicia sesion</button></p>
        </div>
      </section>
    </main>
  );
}

function ClientLogin({ onBack, onCreateAccount }) {
  return (
    <main className="login-page">
      <section className="login-panel" aria-label="Inicio de sesion de cliente">
        <header className="login-hero">
          <button className="login-back-button" type="button" onClick={onBack} aria-label="Volver a bienvenida">
            ←
          </button>
          <img className="login-logo" src={logoJmGym} alt="Logo de JMGym" />
          <h1>JMGym</h1>
          <p>¡Bienvenida de vuelta!</p>
        </header>

        <form className="login-form">
          <div className="login-title">
            <h2>Inicia sesion</h2>
            <p>Ingresa tus datos para continuar.</p>
          </div>

          <label className="field-group">
            <span>DNI o correo electronico</span>
            <div className="input-shell">
              <span aria-hidden="true">🪪</span>
              <input type="text" placeholder="12345678 o tu correo" />
            </div>
          </label>

          <label className="field-group">
            <span>Contraseña</span>
            <div className="input-shell">
              <span aria-hidden="true">🔒</span>
              <input type="password" placeholder="Tu contraseña" />
            </div>
          </label>

          <div className="login-options">
            <label className="remember-option">
              <input type="checkbox" defaultChecked />
              <span>Recordar sesion</span>
            </label>
            <button type="button">¿Olvidaste tu contraseña?</button>
          </div>

          <div className="login-actions">
            <button className="login-primary" type="submit">Ingresar</button>
            <button className="login-secondary" type="button" onClick={onCreateAccount}>Crear cuenta nueva</button>
          </div>
        </form>
      </section>
    </main>
  );
}

function ClientRegister({ onBack, onLogin }) {
  return (
    <main className="register-page">
      <section className="register-panel" aria-label="Registro de cliente JMGym">
        <aside className="register-brand">
          <button className="register-back-button" type="button" onClick={onBack} aria-label="Volver al login">
            ←
          </button>
          <div className="register-logo-row">
            <img className="register-logo" src={logoJmGym} alt="Logo de JMGym" />
            <div>
              <h1>JMGym</h1>
              <p>Gimnasio Ritmo Vital</p>
            </div>
          </div>
          <div className="register-copy">
            <h2>Crear cuenta</h2>
            <p>Unete y reserva tus clases favoritas.</p>
          </div>
        </aside>

        <form className="register-form">
          <label className="field-group">
            <span>Nombre completo</span>
            <div className="input-shell">
              <span aria-hidden="true">👤</span>
              <input type="text" placeholder="Maria Garcia Lopez" />
            </div>
          </label>

          <label className="field-group">
            <span>DNI</span>
            <div className="input-shell">
              <span aria-hidden="true">🪪</span>
              <input type="text" placeholder="12345678" />
            </div>
          </label>

          <label className="field-group">
            <span>Correo electronico</span>
            <div className="input-shell">
              <span aria-hidden="true">✉️</span>
              <input type="email" placeholder="maria@correo.com" />
            </div>
          </label>

          <label className="field-group">
            <span>Contraseña</span>
            <div className="input-shell">
              <span aria-hidden="true">🔒</span>
              <input type="password" placeholder="Minimo 8 caracteres" />
            </div>
          </label>

          <label className="terms-option">
            <input type="checkbox" defaultChecked />
            <span>
              Acepto los <button type="button">terminos y condiciones</button> y la{' '}
              <button type="button">politica de privacidad</button>
            </span>
          </label>

          <div className="register-actions">
            <button className="register-primary" type="submit">Registrarme</button>
            <p>¿Ya tienes cuenta? <button type="button" onClick={onLogin}>Inicia sesion</button></p>
          </div>
        </form>
      </section>
    </main>
  );
}

export default App;
