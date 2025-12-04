import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PasswordInput from '../components/PasswordInput';
import LoginButton from '../components/LoginButton';
import { api } from '../../api';

const RegisterSection = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
    dni: '',
    fecha_nacimiento: '',
    telefono: ''
  });
  const [dniFront, setDniFront] = useState(null);
  const [dniBack, setDniBack] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.password2) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (!dniFront || !dniBack) {
      setError('Debes subir fotos del frente y dorso de tu DNI');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        dni: parseInt(formData.dni, 10)
      };

      // 1. Registrar usuario
      await api.register(payload);

      // 2. Subir DNI
      await api.uploadDNI(dniFront, dniBack);

      navigate('/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full bg-white rounded-2xl p-8 max-w-lg mx-auto">
      {/* Encabezado */}
      <header className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-black mb-2">Crear cuenta</h2>
        <p className="text-gray-500">Ingresa tus datos para registrarte</p>
      </header>

      {/* Formulario */}
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Campo Usuario */}
          <div className="md:col-span-2">
            <label htmlFor="username" className="block text-sm font-medium text-black mb-2">Nombre de usuario</label>
            <input
              id="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Tu nombre de usuario"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-all"
              required
            />
          </div>

          {/* Campo Nombre */}
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-black mb-2">Nombre</label>
            <input
              id="first_name"
              type="text"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="Tu nombre"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-all"
              required
            />
          </div>

          {/* Campo Apellido */}
          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-black mb-2">Apellido</label>
            <input
              id="last_name"
              type="text"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Tu apellido"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-all"
              required
            />
          </div>

          {/* Campo DNI */}
          <div>
            <label htmlFor="dni" className="block text-sm font-medium text-black mb-2">DNI</label>
            <input
              id="dni"
              type="number"
              value={formData.dni}
              onChange={handleChange}
              placeholder="12345678"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-all"
              required
            />
          </div>

          {/* Campo Fecha de Nacimiento */}
          <div>
            <label htmlFor="fecha_nacimiento" className="block text-sm font-medium text-black mb-2">Fecha de Nacimiento</label>
            <input
              id="fecha_nacimiento"
              type="date"
              value={formData.fecha_nacimiento}
              onChange={handleChange}
              max="9999-12-31"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-all"
              required
            />
          </div>

          {/* Campo Teléfono */}
          <div className="md:col-span-2">
            <label htmlFor="telefono" className="block text-sm font-medium text-black mb-2">Teléfono</label>
            <input
              id="telefono"
              type="tel"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="1122334455"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-all"
              required
            />
          </div>

          {/* Campo email */}
          <div className="md:col-span-2">
            <label htmlFor="email" className="block text-sm font-medium text-black mb-2">Correo electrónico</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-all"
              required
            />
          </div>

          {/* Campo contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-black mb-2">Contraseña</label>
            <PasswordInput 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          {/* Campo confirmar contraseña */}
          <div>
            <label htmlFor="password2" className="block text-sm font-medium text-black mb-2">Confirmar Contraseña</label>
            <PasswordInput 
              value={formData.password2}
              onChange={(e) => setFormData({...formData, password2: e.target.value})}
            />
          </div>

          {/* Archivos DNI frente y dorso */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">DNI - Frente</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setDniFront(e.target.files[0])}
              className="w-full text-sm text-gray-500" 
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">DNI - Dorso</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setDniBack(e.target.files[0])}
              className="w-full text-sm text-gray-500" 
              required
            />
          </div>
        </div>

        {/* Botón */}
        <LoginButton type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </LoginButton>
      </form>

      {/* Pie */}
      <footer className="mt-8 text-center text-sm text-gray-500">
        ¿Ya tienes una cuenta?{' '}
        <Link to="/" className="text-purple-600 hover:text-purple-800 font-medium">Inicia sesión aquí</Link>
      </footer>
    </section>
  );
};

export default RegisterSection;
