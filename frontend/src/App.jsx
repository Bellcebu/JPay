import { Routes, Route } from 'react-router-dom';
import Login from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SessionPage from './pages/SessionPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import EditarPerfilPage from './pages/EditarPerfilPage';
import TransferirPage from './pages/TransferirPage';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/sessions" element={<SessionPage />} />  {/* Nueva ruta */}
      <Route path="/home" element={<HomePage />} />
      <Route path="/profile" element={<ProfilePage/>} />
      <Route path="/perfil/editar" element={<EditarPerfilPage/>} />
      <Route path="/transferencias" element={<TransferirPage/>} />
    </Routes>
  );
}

export default App;
