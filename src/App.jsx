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
    return <ClientWelcome onBack={() => setScreen('home')} />;
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

function ClientWelcome({ onBack }) {
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
          <button className="client-start-button" type="button">Comenzar</button>
          <p>¿Ya tienes cuenta? <button type="button">Inicia sesion</button></p>
        </div>
      </section>
    </main>
  );
}

export default App;
