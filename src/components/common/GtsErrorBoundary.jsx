import { Component } from 'react';

export default class GtsErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error('GtsErrorBoundary caught:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#07111f] px-5 text-center text-primary-foreground">
          <div className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-[#3b82f6]/20 text-5xl">
            !
          </div>
          <h1 className="mt-6 text-4xl font-black">Algo salio mal</h1>
          <p className="mt-3 max-w-md text-primary-foreground/60">
            Ocurrio un error inesperado. Recarga la pagina para continuar.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-8 rounded-full bg-[#3b82f6] px-8 py-4 text-sm font-black uppercase tracking-[0.16em] text-white shadow-[0_18px_48px_rgba(34,211,238,.22)] transition hover:-translate-y-1"
          >
            Recargar pagina
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
