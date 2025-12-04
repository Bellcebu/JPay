import React from "react";
import { Link } from "react-router-dom";
import SidebarLayout from "../layouts/SidebarLayout";
import { User, Shield, Smartphone, CreditCard, ChevronRight } from "lucide-react";

const ProfilePage = () => {
    const user = {
        name: "Ariana Méndez",
        email: "ari@example.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alejandro"
    };

    const menuItems = [
        {
            title: "Información de tu perfil",
            description: "Datos personales y de tu cuenta.",
            icon: User,
            path: "/perfil/info",
            color: "text-blue-500"
        },
        {
            title: "Seguridad",
            description: "Tenés configurada la seguridad de tu cuenta.",
            icon: Shield,
            path: "/perfil/seguridad",
            color: "text-green-500"
        },
        {
            title: "Sesiones conectadas",
            description: "Administra tus dispositivos.",
            icon: Smartphone,
            path: "/sessions",
            color: "text-purple-500"
        },
        {
            title: "Tarjetas",
            description: "Tarjetas guardadas en tu cuenta.",
            icon: CreditCard,
            path: "/tarjetas",
            color: "text-orange-500"
        }
    ];

    return (
        <SidebarLayout>
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-6 mb-10 bg-white p-6 rounded-2xl shadow-sm">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border-2 border-purple-100">
                        <img 
                            src={user.avatar} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
                        <p className="text-gray-500">{user.email}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {menuItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <Link 
                                key={index} 
                                to={item.path}
                                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-transparent hover:border-purple-100 group"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-lg bg-gray-50 group-hover:bg-purple-50 transition-colors ${item.color}`}>
                                        <Icon size={24} />
                                    </div>
                                    {index === 0 && (
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    )}
                                </div>
                                <h3 className="font-semibold text-lg text-gray-800 mb-2 group-hover:text-purple-700 transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    {item.description}
                                </p>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </SidebarLayout>
    );
};

export default ProfilePage;