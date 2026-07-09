import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { AccessibilityProvider } from './context/AccessibilityContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import GtsErrorBoundary from './components/common/GtsErrorBoundary.jsx';
import './index.css';
import './i18n/index.js';

createRoot(document.getElementById('root')).render(
  <GtsErrorBoundary>
    <BrowserRouter>
      <ThemeProvider>
        <AccessibilityProvider>
          <AuthProvider>
            <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#07111f] text-primary-foreground">Cargando...</div>}>
              <App />
              <Toaster
                position="top-center"
                toastOptions={{
                  duration: 4000,
                  style: {
                    borderRadius: '16px',
                    padding: '16px 20px',
                    fontSize: '14px',
                    fontWeight: 700,
                  },
                }}
              />
            </Suspense>
          </AuthProvider>
        </AccessibilityProvider>
      </ThemeProvider>
    </BrowserRouter>
  </GtsErrorBoundary>,
);
