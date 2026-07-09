import ScrollToTop from './components/common/ScrollToTop.jsx';
import { ToastProvider } from './components/common/Toast.jsx';
import AppRoutes from './routes/AppRoutes.jsx';

function App() {
  return (
    <ToastProvider>
      <ScrollToTop />
      <AppRoutes />
    </ToastProvider>
  );
}

export default App;
