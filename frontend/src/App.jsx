import { Routes, Route } from 'react-router-dom';
import Login from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SessionPage from './pages/SessionPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import ProfileInfoPage from './pages/ProfileInfoPage';
import EditarPerfilPage from './pages/EditarPerfilPage';
import SolicitudPrestamoPage from './pages/SolicitudPrestamoPage';
import TransferPage from './pages/TransferPage';
import DepositPage from './pages/DepositPage';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/sessions" element={<SessionPage />} /> 
      <Route path="/home" element={<HomePage />} />
      <Route path="/perfil" element={<ProfilePage/>} />
      <Route path="/perfil/info" element={<ProfileInfoPage/>} />
      <Route path="/perfil/editar" element={<EditarPerfilPage/>} />
      <Route path="/prestamo/solicitar" element={<SolicitudPrestamoPage/>} />
      <Route path="/transfer" element={<TransferPage/>} />
      <Route path="/deposit" element={<DepositPage/>} />
    </Routes>
  );
}

export default App;
