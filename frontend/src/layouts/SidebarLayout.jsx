import React from "react";
import { Outlet } from "react-router-dom";
export default function SidebarLayout ({ children }) {
    return (
        <div className = "flex min-h-screen">
            <aside className="fixed left-0 top-0 h-screen w-64 bg-[#2E2E48] text-white flex flex-col p-4 z-20">
                <div>
                    <h2 className="text-4xl font-bold mb-6 text-center">JPAY</h2>
                    <nav className="flex flex-col gap-3">
                    <a href="/perfil" className="hover:bg-white-600 p-2 rounded">Perfil</a>
                    <a href="/dashboard" className="hover:bg-white-600 p-2 rounded">Dashboard</a>
                    <a href="/transferencias" className="hover:bg-white-600 p-2 rounded">Transferencias</a>
                    <a href="/actividad" className="hover:bg-white-600 p-2 rounded">Mi Actividad</a>
                    <a href="/prestamos" className="hover:bg-white-600 p-2 rounded">Préstamos</a>
                    <a href="/ajustes" className="hover:bg-white-600 p-2 rounded">Ajustes</a>
                    </nav>
                </div>

                <div className="border-t border-white-500 mt-4 pt-4">
                    <a
                        href="/logout"
                        className="block text-red-300 hover:text-red-500 transition-colors">
                        🔒 Cerrar sesión
                    </a>
                </div>
            </aside>

            {/* Fondo fijo que cubre toda el área a la derecha del sidebar */}
            <div className="fixed left-64 top-0 right-0 bottom-0 -z-10 bg-gradient-to-br from-slate-50 via-purple-50 to-purple-100" />

            {/* Contenido principal */}
            <main className="ml-64 flex-1 min-h-screen p-6">
                {children}
            </main>
        </div>
    );
}
