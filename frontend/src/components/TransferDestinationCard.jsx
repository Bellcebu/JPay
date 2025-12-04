import React, { useState, useRef, useEffect } from 'react';

export default function TransferDestinationCard({ value, onChange }) {
  const [inputValue, setInputValue] = useState(value || '');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  // Últimos 5 destinatarios (simulado, luego de localStorage/API)
  const ultimosDestinatarios = [
    { alias: '$juan.perez.123', nombre: 'Juan Pérez' },
    { alias: '$maria.gomez.bueno', nombre: 'María Gómez' },
    { alias: '00000000000000000000000', nombre: 'Carlos López' },
    { alias: '$tienda.oficial.abc', nombre: 'Tienda ABC' },
    { alias: '$amigo.frecuente.xyz', nombre: 'Lucas Martínez' }
  ];

  // Filtrar destinatarios según lo que escribe el usuario
  const filteredDestinatarios = ultimosDestinatarios.filter(dest =>
    dest.alias.toLowerCase().includes(inputValue.toLowerCase()) ||
    dest.nombre.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleSelectDestinatario = (alias) => {
    setInputValue(alias);
    onChange(alias);
    setShowDropdown(false);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    onChange(e.target.value);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6 border">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Destino de la transferencia</h2>
      
      <div className="space-y-4 mb-6">
        <div className="relative">
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Escribe el Alias ($nombre) o CBU (22 dígitos)"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            className="w-full p-4 pl-12 pr-12 border-2 border-gray-200 rounded-xl text-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
          />
          
          {/* Icono dentro del input */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            📱
          </div>
          
          {/* Botón desplegable */}
          <button
            onClick={toggleDropdown}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            {showDropdown ? '▲' : '▼'}
          </button>
        </div>

        {/* Dropdown de sugerencias */}
        {(showDropdown || isFocused) && filteredDestinatarios.length > 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl max-h-48 overflow-y-auto shadow-lg">
            {filteredDestinatarios.map((dest, index) => (
              <div
                key={index}
                onClick={() => handleSelectDestinatario(dest.alias)}
                className="p-3 hover:bg-white cursor-pointer border-b border-gray-100 last:border-b-0 flex items-center space-x-3"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">
                    {dest.nombre.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{dest.nombre}</p>
                  <p className="text-sm text-gray-500">{dest.alias}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Ayuda */}
        <p className="text-xs text-gray-500">
          Ejemplo: <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">$juan.perez</code> o <code>00000000000000000000000</code>
        </p>
      </div>

      {/* Botón destinatarios guardados */}
      <button className="w-full px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg flex items-center justify-center space-x-2">
        <span>⭐</span>
        <span>Ver destinatarios guardados</span>
      </button>

        
      
    </div>
  );
}
