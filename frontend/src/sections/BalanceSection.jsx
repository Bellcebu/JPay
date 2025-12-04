import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Share2, ArrowUpRight, ArrowDownLeft, CreditCard } from "lucide-react";
import AccountShareModal from "../components/AccountShareModal";

export default function BalanceSection({ account, loading }) {
  const [showBalance, setShowBalance] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  if (loading) {
      return (
          <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="grid grid-cols-3 gap-4">
                  <div className="h-14 w-14 bg-gray-200 rounded-full mx-auto"></div>
                  <div className="h-14 w-14 bg-gray-200 rounded-full mx-auto"></div>
                  <div className="h-14 w-14 bg-gray-200 rounded-full mx-auto"></div>
              </div>
          </div>
      );
  }

  const alias = account?.alias || "No especificado";
  const balance = account?.saldo ? `$ ${parseFloat(account.saldo).toLocaleString('es-AR', { minimumFractionDigits: 2 })}` : "$ 0,00";

  const actions = [
    { label: "Transferir", to: "/transferencias", icon: ArrowUpRight },
    { label: "Ingresar", to: "/ingresar", icon: ArrowDownLeft },
    { label: "Pagar", to: "/pagar", icon: CreditCard },
  ];

  return (
    <>
      <div className="bg-white p-6 rounded-2xl shadow-sm mb-6">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-gray-600">Dinero disponible</h2>
              <button 
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-purple-500 hover:text-purple-700 transition-colors rounded-full p-1 hover:bg-purple-50"
              >
                  {showBalance ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
          </div>
          <button 
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-2 bg-purple-50 text-purple-600 py-1.5 px-3 rounded-full text-xs font-medium hover:bg-purple-100 transition-colors"
          >
            <span>Alias: {alias}</span>
            <Share2 size={14} />
          </button>
        </div>


        <div className="mb-8">
          <p className="text-4xl font-bold text-gray-900">
              {showBalance ? balance : "$ ••••••••"}
          </p>
        </div>


        <div className="grid grid-cols-3 gap-4">
          {actions.map((action) => {
              const Icon = action.icon;
              return (
                  <Link 
                      key={action.label} 
                      to={action.to}
                      className="flex flex-col items-center gap-2 group"
                  >
                      <div className="w-14 h-14 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-md group-hover:bg-purple-700 group-hover:shadow-lg transition-all duration-200">
                          <Icon size={24} />
                      </div>
                      <span className="text-xs font-medium text-gray-700 group-hover:text-purple-700 transition-colors">
                          {action.label}
                      </span>
                  </Link>
              )
          })}
        </div>
      </div>

      <AccountShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        account={account} 
      />
    </>
  );
}
