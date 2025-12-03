import React from 'react';

export default function TransferCardOrigin({ Owner, Balance }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6 border">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Cuenta de origen</h2>
      
      <div className="space-y-4 mb-6">
        <div>
          <p className="text-sm text-gray-600 mb-1">Titular:</p>
          <p className="text-xl font-bold text-gray-900">{Owner}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600 mb-1">Saldo disponible:</p>
          <p className="text-2xl font-bold text-green-600">${Balance.toLocaleString()}</p>
        </div>
      </div>
      
      <button 
        onClick={() => alert('Seleccionar otra cuenta de origen')}
        className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
      >
        🔄 Seleccionar otra cuenta
      </button>
    </div>
  );
}
