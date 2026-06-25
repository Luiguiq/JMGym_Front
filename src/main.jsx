import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import GtsErrorBoundary from './components/common/GtsErrorBoundary.jsx';
import './index.css';
import './i18n/index.js';

createRoot(document.getElementById('root')).render(
  <GtsErrorBoundary>
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#07111f] text-white">Cargando...</div>}>
          <App />
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  </GtsErrorBoundary>,
);
