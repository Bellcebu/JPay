import { Routes, Route } from 'react-router-dom';
import Login from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SessionPage from './pages/SessionPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import EditarPerfilPage from './pages/EditarPerfilPage';
import SolicitudPrestamoPage from './pages/SolicitudPrestamoPage';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/sessions" element={<SessionPage />} /> 
      <Route path="/dashboard" element={<HomePage />} />
      <Route path="/perfil" element={<ProfilePage/>} />
      <Route path="/perfil/editar" element={<EditarPerfilPage/>} />
      <Route path="/prestamo/solicitar" element={<SolicitudPrestamoPage/>} />
    </Routes>
  );
}

export default App;
