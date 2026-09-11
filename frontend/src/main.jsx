import { StrictMode, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import '@fontsource-variable/fraunces';
import '@fontsource-variable/plus-jakarta-sans';
import './index.css';
import './services/api';
import App from './App.jsx';
import { Layout } from './components/Layout/Layout';
import AdminLayout from './components/Layout/AdminLayout';
import RutaProtegida from './components/Layout/RutaProtegida';

import Home from './pages/Home';
import Cruceros from './pages/Cruceros';
import CruceroDetalle from './pages/CruceroDetalle';
import Barcos from './pages/Barcos';
import BarcoDetalle from './pages/BarcoDetalle';
import Camarotes from './pages/Camarotes';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Reservar from './pages/Reservar';
import MisReservas from './pages/MisReservas';
import ReservaDetalle from './pages/ReservaDetalle';
import NoEncontrado from './pages/NoEncontrado';

// El panel de administración se descarga solo cuando un administrador entra
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminReservas = lazy(() => import('./pages/admin/AdminReservas'));
const AdminCruceros = lazy(() => import('./pages/admin/AdminCruceros'));
const AdminBarcos = lazy(() => import('./pages/admin/AdminBarcos'));
const AdminCamarotes = lazy(() => import('./pages/admin/AdminCamarotes'));
const AdminComplementos = lazy(() => import('./pages/admin/AdminComplementos'));
const AdminUsuarios = lazy(() => import('./pages/admin/AdminUsuarios'));
const AdminFormulario = lazy(() => import('./pages/admin/AdminFormulario'));
const CreateBarco = lazy(() => import('./components/Crucero/CreateBarco').then((m) => ({ default: m.CreateBarco })));
const UpdateBarco = lazy(() => import('./components/Crucero/UpdateBarco').then((m) => ({ default: m.UpdateBarco })));
const CreateCrucero = lazy(() => import('./components/Crucero/CreateCrucero').then((m) => ({ default: m.CreateCrucero })));
const UpdateCrucero = lazy(() => import('./components/Crucero/UpdateCrucero').then((m) => ({ default: m.UpdateCrucero })));
const CreateHabitacion = lazy(() => import('./components/Crucero/CreateHabitacion').then((m) => ({ default: m.CreateHabitacion })));
const UpdateHabitacion = lazy(() => import('./components/Crucero/UpdateHabitacion').then((m) => ({ default: m.UpdateHabitacion })));

const privada = (elemento) => <RutaProtegida>{elemento}</RutaProtegida>;

const rutas = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        element: <Layout />,
        children: [
          { path: '/', element: <Home /> },
          { path: '/cruceros', element: <Cruceros /> },
          { path: '/cruceros/:id', element: <CruceroDetalle /> },
          { path: '/barcos', element: <Barcos /> },
          { path: '/barcos/:id', element: <BarcoDetalle /> },
          { path: '/camarotes', element: <Camarotes /> },
          { path: '/reservar', element: privada(<Reservar />) },
          { path: '/mis-reservas', element: privada(<MisReservas />) },
          { path: '/reservas/:id', element: privada(<ReservaDetalle />) },
          { path: '*', element: <NoEncontrado /> },
        ],
      },
      { path: '/login', element: <Login /> },
      { path: '/registro', element: <Registro /> },
      {
        path: '/admin',
        element: <RutaProtegida soloAdmin><AdminLayout /></RutaProtegida>,
        children: [
          { index: true, element: <Dashboard /> },
          { path: 'reservas', element: <AdminReservas /> },
          { path: 'cruceros', element: <AdminCruceros /> },
          { path: 'cruceros/crear', element: <AdminFormulario volverA="/admin/cruceros"><CreateCrucero /></AdminFormulario> },
          { path: 'cruceros/editar/:id', element: <AdminFormulario volverA="/admin/cruceros"><UpdateCrucero /></AdminFormulario> },
          { path: 'barcos', element: <AdminBarcos /> },
          { path: 'barcos/crear', element: <AdminFormulario volverA="/admin/barcos"><CreateBarco /></AdminFormulario> },
          { path: 'barcos/editar/:id', element: <AdminFormulario volverA="/admin/barcos"><UpdateBarco /></AdminFormulario> },
          { path: 'camarotes', element: <AdminCamarotes /> },
          { path: 'camarotes/crear', element: <AdminFormulario volverA="/admin/camarotes"><CreateHabitacion /></AdminFormulario> },
          { path: 'camarotes/editar/:id', element: <AdminFormulario volverA="/admin/camarotes"><UpdateHabitacion /></AdminFormulario> },
          { path: 'complementos', element: <AdminComplementos /> },
          { path: 'usuarios', element: <AdminUsuarios /> },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={rutas} />
  </StrictMode>
);
