import React from "react";
import { Link } from 'react-router-dom';

export default function ProfileSection({ usuario = {} }) {
  const {
    nombre = '',
    apellido = '',
    dni = '',
    fecha_nacimiento = usuario.fechaNacimiento || usuario.fecha_nacimiento || '',
    telefono = '',
    email = '',
    cbu = '',
    alias = '',
    estado_verificacion = '',
  } = usuario;

  return (
    <section className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-10">
      <header className="mb-6 text-center">
        <h2 className="text-3xl font-semibold text-black mb-1">Mi Perfil</h2>
        <p className="text-sm text-gray-500">Gestiona la información de tu cuenta</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-gray-600">Nombre</label>
          <p className="mt-1 text-gray-800">{nombre}</p>
        </div>

        <div>
          <label className="block text-sm text-gray-600">Apellido</label>
          <p className="mt-1 text-gray-800">{apellido}</p>
        </div>

        <div>
          <label className="block text-sm text-gray-600">DNI</label>
          <p className="mt-1 text-gray-800">{dni}</p>
        </div>

        <div>
          <label className="block text-sm text-gray-600">Fecha de nacimiento</label>
          <p className="mt-1 text-gray-800">{fecha_nacimiento}</p>
        </div>

        <div>
          <label className="block text-sm text-gray-600">Teléfono</label>
          <p className="mt-1 text-gray-800">{telefono}</p>
        </div>

        <div>
          <label className="block text-sm text-gray-600">Email</label>
          <p className="mt-1 break-words text-gray-800">{email}</p>
        </div>

        <div>
          <label className="block text-sm text-gray-600">CBU</label>
          <p className="mt-1 text-gray-800">{cbu}</p>
        </div>

        <div>
          <label className="block text-sm text-gray-600">Estado civil</label>
          <p className="mt-1 text-gray-800">{usuario.estado_civil || 'No especificado'}</p>
        </div>

        <div>
          <label className="block text-sm text-gray-600">Alias</label>
          <p className="mt-1 text-gray-800">{alias}</p>
        </div>

        <div>
          <label className="block text-sm text-gray-600">Estado de verificación</label>
          <p className="mt-1 text-gray-800">{estado_verificacion}</p>
        </div>

        <div className="md:col-span-1 text-center mt-4">
          <Link to="/perfil/editar" className="inline-block bg-purple-600 text-white py-2 px-8 rounded-lg hover:bg-purple-700 transition-colors">
            Editar Perfil
          </Link>
        </div>

        <div className="md:col-span-1 text-center mt-2">
          <Link to="/sessions" className="inline-block bg-gray-200 text-gray-800 py-2 px-8 rounded-lg hover:bg-gray-300 transition-colors">
            Administrar Sesiones
          </Link>
        </div>
      </div>
    </section>
  );
}
