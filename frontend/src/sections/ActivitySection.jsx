import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowDownLeft, ArrowUpRight } from "lucide-react";

export default function ActivitySection() {
  const activities = [
    {
      id: 1,
      title: "Pasteleria Naty",
      subtitle: "Pago",
      amount: "- $ 1.000,00",
      date: "1/dic",
      type: "payment",
      status: "Dinero disponible"
    },
    {
      id: 2,
      title: "YO",
      subtitle: "Dinero retirado",
      amount: "+ $ 700,00",
      date: "1/dic",
      type: "income",
      status: ""
    },
    {
      id: 3,
      title: "Raul Claudio Guzmán Oyarzo",
      subtitle: "Pago en tienda física",
      amount: "- $ 25.400,00",
      date: "1/dic",
      type: "payment",
      status: ""
    }
  ];

  const getIcon = (type) => {
    switch (type) {
      case "payment":
        return <ShoppingBag size={24} />;
      case "income":
        return <ArrowDownLeft size={24} />;
      case "transfer":
        return <ArrowUpRight size={24} />;
      default:
        return <ShoppingBag size={24} />;
    }
  };

  const getAmountColor = (type) => {
    return type === "income" ? "text-green-600" : "text-gray-900";
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
        {activities.map((activity) => (
          <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors">
                {getIcon(activity.type)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                <p className="text-sm text-gray-500">{activity.subtitle}</p>
                {activity.status && (
                  <p className="text-xs text-blue-500 mt-0.5 flex items-center gap-1">
                    {activity.status}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className={`font-bold ${getAmountColor(activity.type)}`}>
                {activity.amount}
              </p>
              <p className="text-xs text-gray-400 mt-1">{activity.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
