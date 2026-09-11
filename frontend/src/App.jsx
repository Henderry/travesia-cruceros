import { CssBaseline, ThemeProvider } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { appTheme, colores } from './themes/theme';
import { AuthProvider } from './context/AuthContext';

/** Raíz de la aplicación: tema, sesión y notificaciones */
export default function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline enableColorScheme />
      <AuthProvider>
        <Outlet />
        <Toaster
          position="bottom-right"
          toastOptions={{ style: { borderRadius: 12, background: colores.tinta, color: '#fff', fontWeight: 500 } }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}
