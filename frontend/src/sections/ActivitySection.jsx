import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import ReceiptModal from "../components/ReceiptModal";

export default function ActivitySection({ transactions, loading }) {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getIcon = (type) => {
    switch (type) {
      case "debito":
        return <ShoppingBag size={24} />;
      case "credito":
        return <ArrowDownLeft size={24} />;
      case "transferencia":
        return <ArrowUpRight size={24} />;
      default:
        return <ShoppingBag size={24} />;
    }
  };

  const getAmountColor = (type) => {
    return type === "credito" ? "text-green-600" : "text-gray-900";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
  };

  const formatAmount = (amount) => {
    return `$ ${parseFloat(amount).toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Últimas actividades</h2>
        <Link to="/actividad" className="text-purple-600 font-medium text-sm hover:text-purple-700">
          Ir a Actividad
        </Link>
      </div>

      <div className="divide-y divide-gray-100">
        {transactions && transactions.length > 0 ? (
          transactions.map((activity) => (
            <div 
              key={activity.id} 
              onClick={() => setSelectedTransaction(activity)}
              className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors">
                  {getIcon(activity.tipo)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {activity.descripcion || (activity.tipo === 'transferencia' ? 'Transferencia' : 'Movimiento')}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {activity.tipo === 'credito' 
                      ? (activity.descripcion?.toLowerCase().includes('transferencia') ? 'Transferencia recibida' : 'Ingreso de dinero')
                      : (activity.descripcion?.toLowerCase().includes('transferencia') ? 'Transferencia enviada' : 'Pago realizado')
                    }
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${getAmountColor(activity.tipo)}`}>
                  {activity.tipo === 'debito' || (activity.tipo === 'transferencia' && parseFloat(activity.monto) < 0) ? '-' : '+'} {formatAmount(Math.abs(activity.monto))}
                </p>
                <p className="text-xs text-gray-400 mt-1">{formatDate(activity.creado_en)}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            No hay actividad reciente
          </div>
        )}
      </div>

      <ReceiptModal 
        isOpen={!!selectedTransaction} 
        onClose={() => setSelectedTransaction(null)} 
        transaction={selectedTransaction} 
      />
    </div>
  );
}
