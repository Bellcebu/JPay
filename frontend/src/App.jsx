import { Routes, Route } from 'react-router-dom';
import Login from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/profile" element={<ProfilePage/>} />
    </Routes>
  );
}

export default App;
