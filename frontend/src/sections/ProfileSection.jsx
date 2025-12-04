import React, { useState, useEffect } from "react";
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
  Heart,
  Camera
} from "lucide-react";
import { api } from "../../api";

export default function ProfileSection({ usuario = {} }) {
  const {
    id,
    nombre = '',
    apellido = '',
    dni = '',
    fecha_nacimiento = usuario.fechaNacimiento || usuario.fecha_nacimiento || '',
    telefono = '',
    email = '',
    cbu = '',
    alias = '',
    estado_verificacion = '',
    estado_civil = usuario.estado_civil || 'No especificado',
    username = ''
  } = usuario;

  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    if (id) {
        const storedImage = api.getProfilePicture(id);
        if (storedImage) {
            setProfileImage(storedImage);
        } else {
            setProfileImage(`https://api.dicebear.com/7.x/avataaars/svg?seed=${username || 'JPay'}`);
        }
    }
  }, [id, username]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setProfileImage(base64String);
        if (id) {
            api.setProfilePicture(id, base64String);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const personalInfo = [
    { label: "Número de DNI", value: dni, icon: IdCard, editable: false },
    { label: "Nombre", value: nombre, icon: User, editable: false },
    { label: "Apellido", value: apellido, icon: User, editable: false },
    { label: "Estado civil", value: estado_civil, icon: Heart, editable: true },
    { label: "Fecha de nacimiento", value: fecha_nacimiento, icon: Calendar, editable: false },
  ];

  const accountData = [
    { label: "Email", value: email, icon: Mail, editable: true },
    { label: "Teléfono", value: telefono, icon: Phone, editable: true },
    { label: "CBU", value: cbu, icon: CreditCard, editable: false },
    { label: "Alias", value: alias, icon: AtSign, editable: true },
    { label: "Estado de verificación", value: estado_verificacion, icon: ShieldCheck, editable: false },
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
              
              {item.editable && (
                <Link 
                  to="/perfil/editar" 
                  className="text-purple-600 font-medium text-sm hover:text-purple-800 px-3 py-1 rounded-full hover:bg-purple-50 transition-colors"
                >
                  Modificar
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <section className="w-full max-w-4xl mx-auto">
      <header className="mb-8 flex flex-col md:flex-row items-center gap-6">
        <div className="relative group cursor-pointer">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white" size={24} />
            </div>
            <input 
                type="file" 
                accept="image/*" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleImageUpload}
            />
        </div>
        
        <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Información de tu perfil</h2>
            <p className="text-gray-600">Podés agregar, modificar o corregir tu información personal y los datos de la cuenta.</p>
        </div>
      </header>

      {renderGroup("Información personal", personalInfo)}
      {renderGroup("Datos de la cuenta", accountData)}
    </section>
  );
}
