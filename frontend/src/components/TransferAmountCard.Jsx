import React, { useState } from 'react';

export default function TransferAmountCard({ value, onChange }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 border">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Monto de la transferencia</h2> 
      <div>
        <input 
          type="number" 
          placeholder="Ingresa el monto a transferir" 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );

}