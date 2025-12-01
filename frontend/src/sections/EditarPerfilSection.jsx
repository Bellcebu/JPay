import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

export default function EditarPerfilSection({ usuario = {} }) {
  const {
    nombre = '',
    apellido = '',
    dni = '',
    fecha_nacimiento = usuario.fecha_nacimiento || usuario.fechaNacimiento || '',
    telefono = '',
    email = '',
    alias = '',
  } = usuario;

  // local editable state
  const [form, setForm] = useState({
    nombre,
    apellido,
    telefono,
    alias,
    email,
  });

  // verification states (front-only)
  const [aliasInitial] = useState(alias);
  const [emailInitial] = useState(email);
  const [aliasPending, setAliasPending] = useState(false);
  const [emailPending, setEmailPending] = useState(false);
  const [aliasVerified, setAliasVerified] = useState(true);
  const [emailVerified, setEmailVerified] = useState(true);

  // saved message state
  const [saved, setSaved] = useState(false);
  // detect changes compared to initial values and require re-verification
  useEffect(() => {
    if (form.alias !== aliasInitial) {
      setAliasVerified(false);
      setAliasPending(false); // user must request
    } else {
      setAliasVerified(true);
      setAliasPending(false);
    }
  }, [form.alias, aliasInitial]);

  useEffect(() => {
    if (form.email !== emailInitial) {
      setEmailVerified(false);
      setEmailPending(false);
    } else {
      setEmailVerified(true);
      setEmailPending(false);
    }
  }, [form.email, emailInitial]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((s) => ({ ...s, [id]: value }));
    if (saved) setSaved(false);
  };

  // simulate request for verification (front-end only)
  const requestAliasVerification = () => setAliasPending(true);
  const requestEmailVerification = () => setEmailPending(true);

  // simulate completing verification (front-end only)
  const confirmAliasVerified = () => {
    setAliasPending(false);
    setAliasVerified(true);
  };
  const confirmEmailVerified = () => {
    setEmailPending(false);
    setEmailVerified(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // front-only: prevent submit if alias/email need verification
    if (!aliasVerified || !emailVerified) return;
    // Aquí iría la llamada real para guardar cambios (fetch/axios).
    console.log("Guardar (front-only):", form);
    {/*alert("Cambios guardados (simulación front-end).");*/}
    setSaved(true);

  };

  return (
    <section className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-10">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-semibold text-black mb-1">Editar Perfil</h1>
      </header>

      <h3 className="text-lg font-medium text-black mb-6">Datos personales</h3>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nombre */}
        <div>
          <label htmlFor="nombre" className="block text-sm text-black mb-2">Nombre</label>
          <input
            id="nombre"
            type="text"
            value={form.nombre}
            onChange={handleChange}
            className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
          />
        </div>

        {/* Apellido */}
        <div>
          <label htmlFor="apellido" className="block text-sm text-black mb-2">Apellido</label>
          <input
            id="apellido"
            type="text"
            value={form.apellido}
            onChange={handleChange}
            className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
          />
        </div>

        {/* DNI */}
        <div>
          <label htmlFor="dni" className="block text-sm text-black mb-2">DNI</label>
          <input
            id="dni"
            type="text"
            value={dni}
            readOnly
            className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg"
          />
        </div>

        {/* Fecha de nacimiento */}
        <div>
          <label htmlFor="birthdate" className="block text-sm text-black mb-2">Fecha de nacimiento</label>
          <input
            id="birthdate"
            type="date"
            value={fecha_nacimiento}
            readOnly
            className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg"
          />
        </div>

        {/* Teléfono */}
        <div>
          <label htmlFor="telefono" className="block text-sm text-black mb-2">Teléfono</label>
          <input
            id="telefono"
            type="text"
            value={form.telefono}
            onChange={handleChange}
            className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
          />
        </div>

        

        

        {/* Estado civil */}
        <div>
          <label htmlFor="civilStatus" className="block text-sm text-black mb-2">Estado civil</label>
          <select
            id="civilStatus"
            className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2  focus:border-purple-500"
          >
            <option value="">Selecciona una opción</option>
            <option value="soltero">Soltero/a</option>
            <option value="casado">Casado/a</option>
            <option value="divorciado">Divorciado/a</option>
            <option value="viudo">Viudo/a</option>
          </select>
        </div>

        {/* Botón (ocupa 2 columnas) */}
        <div className="md:col-span-2"> 
          <button type="submit" className="w-full py-4 px-4 rounded-xl text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition duration-200" 
            > Guardar cambios 
          </button> 

          {/* Mensaje de éxito */}
          {saved && <p className="text-m text-green-600 mt-2 text-center">Datos procesados correctamente</p>}

        </div>
      </form>

      <h3 style={{ marginTop: '20px'}} className="text-lg font-medium text-black mb-6">Datos bancarios y de contacto</h3>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Alias (requiere re-verificación si cambia) */}
        <div>
          <label htmlFor="alias" className="block text-sm text-black mb-2">Alias</label>
          <div className="flex gap-3">
            <input
              id="alias"
              type="text"
              value={form.alias}
              onChange={handleChange}
              className="flex-1 px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
            />
            {!aliasVerified && !aliasPending && (
              <button type="button" onClick={requestAliasVerification} className="px-3 py-2 rounded-md bg-yellow-400 text-black">
                Solicitar re-verificación
              </button>
            )}

            {!aliasVerified && aliasPending && (
              <span className="px-3 py-2 rounded-md bg-blue-100 text-blue-800 self-center">Verificación solicitada</span>
            )}
            
            {aliasVerified && (
              <span className="px-3 py-2 rounded-md bg-green-100 text-green-800 self-center">Verificado</span>
            )}
          </div>
          {!aliasVerified && <p className="text-sm text-yellow-600 mt-1">El alias cambió y requiere re-verificación.</p>}
        </div>

        
        {/* Email (requiere re-verificación si cambia) */}
        <div>
          <label htmlFor="email" className="block text-sm text-black mb-2">Email</label>
          <div className="flex gap-3">
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="flex-1 px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
            />
            {!emailVerified && !emailPending && (
              <button type="button" onClick={requestEmailVerification} className="px-3 py-2 rounded-md bg-yellow-400 text-black">
                Solicitar re-verificación
              </button>
            )}

            {!emailVerified && emailPending && (
              <span className="px-3 py-2 rounded-md bg-blue-100 text-blue-800 self-center">Verificación solicitada</span>
            )}
            
            {emailVerified && (
              <span className="px-3 py-2 rounded-md bg-green-100 text-green-800 self-center">Verificado</span>
            )}
          </div>
          {!emailVerified && <p className="text-sm text-yellow-600 mt-1">El email cambió y requiere re-verificación.</p>}
        </div>

      </form>
    </section>
  );
}
