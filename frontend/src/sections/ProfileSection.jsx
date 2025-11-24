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
    estado_verificacion = '',
  } = usuario;

  const formattedFecha = fecha_nacimiento
    ? (() => {
        const d = new Date(fecha_nacimiento);
        return Number.isNaN(d.getTime()) ? fecha_nacimiento : d.toLocaleDateString();
      })()
    : '';

  return (
    <section className="w-full max-w-[1100px] mx-auto bg-white rounded-2xl shadow-lg p-10">
      <header className="mb-6 text-center">
        <h2 className="text-3xl font-semibold text-black mb-1">Mi Perfil</h2>
        <p className="text-sm text-gray-500">Gestiona la información de tu cuenta</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
          <p className="mt-1 text-gray-800">{formattedFecha}</p>
        </div>

        <div>
          <label className="block text-sm text-gray-600">Teléfono</label>
          <p className="mt-1 text-gray-800">{telefono}</p>
        </div>

        <div>
          <label className="block text-sm text-gray-600">Email</label>
          <p className="mt-1 break-words text-gray-800">{email}</p>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm text-gray-600">Estado de verificación</label>
          <p className="mt-1 text-gray-800">{estado_verificacion}</p>
        </div>

        <div className="md:col-span-2 text-center mt-6">
          <Link to="/perfil/editar" className="inline-block bg-purple-600 text-white py-2 px-8 rounded-lg hover:bg-purple-700 transition-colors">
            Editar Perfil
          </Link>
        </div>
      </div>
    </section>
  );
}
