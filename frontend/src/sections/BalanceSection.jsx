import React, { useState} from "react";
import HomeButton from "../components/HomeButton";
import { Link } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react";

const actions = [
    {label: "Transferir", to: "/transferir"},
    {label: "Ingresar", to: "/ingresar"},
    {label: "Pagar", to: "/pagar"},        
];

export default function BalanceSection({usuario = {}}) {
  const{
    saldo = '20500,70',
  } = usuario;


  const [showSaldo, setShowSaldo] = useState(true);


  const [entero, centavos] = saldo.split(',');
  const saldoFormateado = entero.replace(/\B(?=(\d{3})+(?!\d))/g, ".");



  const toggleSaldo = () => {
    setShowSaldo(!showSaldo);
  };


  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-5xl mx-auto">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-3xl font-bold text-gray-800">Saldo disponible</h2>




        <button className="bg-purple-200 text-purple-700 py-1 px-4 rounded-full text-sm font-medium">
          Tu CVU
        </button>
      </div>
      <div className="flex items-center justify-center gap-4 mb-8">
        <p className="text-5xl font-regular text-gray-900">
        {showSaldo ? (
            <>
              {/* Saldo Principal con Puntos */}
              $ {saldoFormateado}
              {/* Centavos: reducidos y elevados */}
              <span className="align-super text-3xl ml-1 text-gray-700">
                ,{centavos}
              </span>
            </>
          ) : (
            "*****"
          )}
        </p>

        <button
          onClick={() => setShowSaldo(!showSaldo)}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 text-xs text-gray-600 hover:bg-gray-50"
        >
          {showSaldo ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
        </button>
      </div>
    
      <div className="flex space-x-10">
        {actions.map((a) => (
          <HomeButton key={a.label} onClick={() => go(a.to)}>
            {a.label}
          </HomeButton>
        ))}
      </div>
    </div>
  );
}
