import React from "react";
import HomeButton from "../components/HomeButton";
import { Link } from "react-router-dom"

const actions = [
    {label: "Transferir", to: "/transferir"},
    {label: "Ingresar", to: "/ingresar"},
    {label: "Pagar", to: "/pagar"},         
];

export default function BalanceSection() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Saldo disponible</h2>
        <button className="bg-purple-200 text-purple-700 py-1 px-4 rounded-full text-sm font-medium">
          Tu CVU
        </button>
      </div>

      {/* Saldo principal */}
      <p className="text-5xl font-extrabold text-gray-900 mb-8">
        $150.320,50
      </p>

      {/* Botones de acción (usando un gradiente de ejemplo) */}
      <div className="flex space-x-4">
        {actions.map((a) => (
          <HomeButton key={a.label} onClick={() => go(a.to)}>
            {a.label}
          </HomeButton>
        ))}
      </div>
    </div>
  );
}
