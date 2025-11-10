import PasswordInput from '../components/PasswordInput';
import LoginButton from '../components/LoginButton';
import { Link } from 'react-router-dom';

const LoginSection = () => {
  return (
    <section className="w-full bg-white rounded-2xl p-8">
      {/* Encabezado */}
      <header className="mb-6 text-center">
        <h2 className="text-xl font-medium text-black mb-2">Bienvenido de nuevo</h2>
        <p className="text-sm text-gray-500">Ingresa tus credenciales para continuar</p>
      </header>

      {/* Formulario */}
      <form className="space-y-6">

        {/* Campo email */}
        <div>
          <label htmlFor="email" className="block text-sm text-black mb-2">Correo electrónico</label>
          <input
            id="email"
            type="email"
            placeholder="tu@email.com"
            className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
          />
        </div>

        {/* Campo contraseña */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="password" className="text-sm text-black">Contraseña</label>
            <a href="#" className="text-sm text-purple-600 hover:text-purple-800">¿Olvidaste tu contraseña?</a>
          </div>
          <PasswordInput />
        </div>

        {/* Checkbox Recordarme */}
        <div className="flex items-center gap-2">
          <input
            id="remember"
            type="checkbox"
            className="w-4 h-4 text-purple-600 bg-gray-50 border border-gray-300 rounded focus:ring-purple-500"
          />
          <label htmlFor="remember" className="text-sm text-gray-500">Recordarme</label>
        </div>

        {/* Botón */}
        <LoginButton>Iniciar Sesión</LoginButton>
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
