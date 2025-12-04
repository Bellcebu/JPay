import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PasswordInput from '../components/PasswordInput';
import LoginButton from '../components/LoginButton';
import { api } from '../../api';

const LoginSection = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedUsername = localStorage.getItem('savedUsername');
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.login(username, password);
      
      if (rememberMe) {
        localStorage.setItem('savedUsername', username);
      } else {
        localStorage.removeItem('savedUsername');
      }

      navigate('/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full max-w-md mx-auto bg-white rounded-2xl p-8">
      {/* Encabezado */}
      <header className="mb-6 text-center">
        <h2 className="text-xl font-medium text-black mb-2">Bienvenido de nuevo</h2>
        <p className="text-sm text-gray-500">Ingresa tus credenciales para continuar</p>
      </header>

      {/* Formulario */}
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Campo Usuario */}
        <div>
          <label htmlFor="username" className="block text-sm text-black mb-2">Nombre de usuario</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Tu usuario"
            className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
            required
          />
        </div>

        {/* Campo contraseña */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="password" className="text-sm text-black">Contraseña</label>
            <a href="#" className="text-sm text-purple-600 hover:text-purple-800">¿Olvidaste tu contraseña?</a>
          </div>
          <PasswordInput 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Checkbox Recordarme */}
        <div className="flex items-center gap-2">
          <input
            id="remember"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 text-purple-600 bg-gray-50 border border-gray-300 rounded focus:ring-purple-500"
          />
          <label htmlFor="remember" className="text-sm text-gray-500">Recordarme</label>
        </div>

        {/* Botón */}
        <LoginButton type="submit" disabled={loading}>
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </LoginButton>
      </form>

      {/* Pie */}
      <footer className="mt-6 text-center text-sm text-gray-500">
        ¿No tienes una cuenta?{' '}
        <Link to="/register" className="text-purple-600 hover:text-purple-800">Regístrate aquí</Link>
      </footer>
    </section>
  );
};

export default LoginSection;
