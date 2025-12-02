import React from "react";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";


const transactions = [
  { id: 1, descripcion: "Pago a Juan Pérez", tipo: "Pago", monto: 1500, fecha: "2024-06-10" },
  { id: 2, descripcion: "Transferencia recibida de Ana Gómez", tipo: "Depósito", monto: 2500, fecha: "2024-06-09" },
  { id: 3, descripcion: "Pago de servicios", tipo: "Pago", monto: 800, fecha: "2024-06-08" },
  { id: 4, descripcion: "Transferencia enviada a Carlos Ruiz", tipo: "Pago", monto: 1200, fecha: "2024-06-07" },
  { id: 5, descripcion: "Depósito en efectivo", tipo: "Depósito", monto: 3000, fecha: "2024-06-06" },
];


const filteredTransactions = transactions.slice(0, 4);


export default function ActivitySection() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-5xl mx-auto mt-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Actividad reciente</h2>
        <div className="space-y-3">
            {filteredTransactions.length > 0 ? (
            filteredTransactions.map((tx) => {
                const esDeposito = tx.tipo === "Depósito";


                return (
                <div
                    key={tx.id}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                    {/* Izquierda: icono + texto */}
                    <div className="flex items-center gap-4">
                    {/* Icono redondo con colores tipo ejemplo */}
                    <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full
                        ${esDeposito ? "bg-emerald-100" : "bg-rose-100"}`}
                    >
                        {esDeposito ? (
                        <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
                        ) : (
                        <ArrowUpRight className="w-5 h-5 text-rose-600" />
                        )}
                    </div>


                    <div>
                        <p className="font-semibold text-gray-800">{tx.descripcion}</p>
                        <p className="text-sm text-gray-500">
                        {tx.tipo} • {tx.fecha}
                        </p>
                    </div>
                    </div>


                    {/* Derecha: monto */}
                    <p
                    className={`text-lg`}
                    >
                    {esDeposito ? "+" : "-"}${tx.monto}
                    </p>
                </div>
                );
            })
            ) : (
            <p className="text-center text-gray-500 py-6">
                No se encontraron transacciones
            </p>
            )}
        </div>


        <div className="text-center mt-6">
            <a
            href="/actividad"
            className="text-purple-700 hover:underline underline-offset-4"
            >
            Ver toda la actividad
            </a>
        </div>
    </div>
  );
}
