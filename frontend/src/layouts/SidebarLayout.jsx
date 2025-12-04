import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { User, Home, CreditCard, Activity, FileText, Settings, LogOut, Menu, X } from "lucide-react";
import { api } from "../../api";

export default function SidebarLayout({ children }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await api.logout();
        navigate('/');
    };

    const navItems = [
        { path: "/perfil", label: "Perfil", icon: User },
        { path: "/home", label: "Home", icon: Home },
        { path: "/transfer", label: "Transferencias", icon: CreditCard },
        { path: "/actividad", label: "Mi Actividad", icon: Activity },
        { path: "/prestamos", label: "Préstamos", icon: FileText },
        { path: "/ajustes", label: "Ajustes", icon: Settings },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50">
            <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="fixed top-4 right-4 z-50 p-2 bg-[#2E2E48] text-white rounded-lg md:hidden shadow-lg hover:bg-[#3a3a5a] transition-colors"
            >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            <aside className={`
                fixed left-0 top-0 h-screen w-64 bg-[#2E2E48] text-white flex flex-col p-4 z-40
                transition-transform duration-300 ease-in-out shadow-xl
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0
            `}>
                <div>
                    <div className="flex items-center gap-3 mb-8 px-2">
                        <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                            <span className="font-bold text-lg">J</span>
                        </div>
                        <h2 className="text-xl font-bold tracking-wider">JPAY</h2>
                    </div>

                    <nav className="flex flex-col gap-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`
                                        flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group
                                        ${isActive 
                                            ? 'bg-purple-600 text-white shadow-md' 
                                            : 'text-gray-300 hover:bg-[#3a3a5a] hover:text-white'
                                        }
                                    `}
                                >
                                    <Icon size={20} className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'} />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-700">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 p-3 rounded-lg text-red-300 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Cerrar sesión</span>
                    </button>
                </div>
            </aside>

            <div className="flex-1 md:ml-64 min-h-screen relative">
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-50 via-purple-50 to-purple-100" />
                <main className="p-4 md:p-8 pt-20 md:pt-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
