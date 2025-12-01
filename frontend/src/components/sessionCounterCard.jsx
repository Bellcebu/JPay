import React from 'react';
export default function sessionCounterCard({ countActived }) {

    return (
  <div className="bg-white shadow-md rounded-lg p-4 mb-4">
    Controlador de Sesiones
    <h3 className="text-lg font-semibold mb-2">
      {countActived === 0 ? "Sin sesiones activas" : `Cuentas activas: ${countActived}`}
    </h3>
    
  </div>
);


}