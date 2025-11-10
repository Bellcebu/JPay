import { Link } from 'react-router-dom';

const RegisterSection = () => {
  return (
    <section className="w-full bg-white rounded-2xl shadow-lg p-8">
      <header className="mb-6 text-center">
        <h2 className="text-xl font-medium text-black mb-2">Crear cuenta</h2>
        <p className="text-sm text-gray-500">Completa tus datos para registrarte</p>
      </header>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nombre */}
        <div>
          <label htmlFor="firstName" className="block text-sm text-black mb-2">Nombre</label>
          <input
            id="firstName"
            type="text"
            placeholder="Juan"
            className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
          />
        </div>

        {/* Apellido */}
        <div>
          <label htmlFor="lastName" className="block text-sm text-black mb-2">Apellido</label>
          <input
            id="lastName"
            type="text"
            placeholder="Pérez"
            className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
          />
        </div>

        {/* DNI */}
        <div>
          <label htmlFor="dni" className="block text-sm text-black mb-2">DNI</label>
          <input
            id="dni"
            type="text"
            placeholder="12345678"
            className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
          />
        </div>

        {/* Fecha de nacimiento */}
        <div>
          <label htmlFor="birthdate" className="block text-sm text-black mb-2">Fecha de nacimiento</label>
          <input
            id="birthdate"
            type="date"
            className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
          />
        </div>

        {/* Estado civil (ocupa 2 columnas) */}
        <div className="md:col-span-2">
          <label htmlFor="civilStatus" className="block text-sm text-black mb-2">Estado civil</label>
          <select
            id="civilStatus"
            className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
          >
            <option value="">Selecciona una opción</option>
            <option value="soltero">Soltero/a</option>
            <option value="casado">Casado/a</option>
            <option value="divorciado">Divorciado/a</option>
            <option value="viudo">Viudo/a</option>
          </select>
        </div>

        {/* Archivos DNI frente y dorso */}
        <div>
          <label className="block text-sm text-black mb-2">DNI - Frente</label>
          <input type="file" accept="image/*" className="w-full text-sm text-gray-500" />
        </div>

        <div>
          <label className="block text-sm text-black mb-2">DNI - Dorso</label>
          <input type="file" accept="image/*" className="w-full text-sm text-gray-500" />
        </div>

        {/* Selfie (ocupa 2 columnas) */}
        <div className="md:col-span-2">
          <label className="block text-sm text-black mb-2">Selfie</label>
          <input type="file" accept="image/*" className="w-full text-sm text-gray-500" />
        </div>

        {/* Botón (ocupa 2 columnas) */}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full py-4 px-4 rounded-xl text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition duration-200"
          >
            Crear cuenta
          </button>
        </div>
      </form>

      {/* Footer */}
      <footer className="mt-6 text-center text-sm text-gray-500">
        ¿Ya tienes una cuenta?{' '}
        <Link to="/" className="text-purple-600 hover:text-purple-800">Inicia sesión</Link>
      </footer>
    </section>
  );
};

export default RegisterSection;
