import React from "react";
import { Link } from 'react-router-dom';
import { 
  User, 
  IdCard, 
  Calendar, 
  Mail, 
  Phone, 
  CreditCard, 
  AtSign, 
  ShieldCheck, 
  ChevronRight,
  Heart
} from "lucide-react";

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
    estado_civil = usuario.estado_civil || 'No especificado'
  } = usuario;

  const personalInfo = [
    { label: "Número de DNI", value: dni, icon: IdCard },
    { label: "Nombre", value: nombre, icon: User },
    { label: "Apellido", value: apellido, icon: User },
    { label: "Estado civil", value: estado_civil, icon: Heart },
    { label: "Fecha de nacimiento", value: fecha_nacimiento, icon: Calendar },
  ];

  const accountData = [
    { label: "Email", value: email, icon: Mail },
    { label: "Teléfono", value: telefono, icon: Phone },
    { label: "CBU", value: cbu, icon: CreditCard },
    { label: "Alias", value: alias, icon: AtSign },
    { label: "Estado de verificación", value: estado_verificacion, icon: ShieldCheck },
  ];

  const renderGroup = (title, items) => (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="text-gray-400 group-hover:text-purple-600 transition-colors">
                  <Icon size={24} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{item.value || 'No especificado'}</p>
                  <p className="text-sm text-gray-500">{item.label}</p>
                </div>
              </div>
              
              <Link 
                to="/perfil/editar" 
                className="text-purple-600 font-medium text-sm hover:text-purple-800 px-3 py-1 rounded-full hover:bg-purple-50 transition-colors"
              >
                Modificar
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <section className="w-full max-w-4xl mx-auto">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Información de tu perfil</h2>
        <p className="text-gray-600">Podés agregar, modificar o corregir tu información personal y los datos de la cuenta.</p>
      </header>

      {renderGroup("Información personal", personalInfo)}
      {renderGroup("Datos de la cuenta", accountData)}
    </section>
  );
}
