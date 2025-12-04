import React, { useState, useEffect } from "react";
import SidebarLayout from "../layouts/SidebarLayout";
import ProfileSection from "../sections/ProfileSection";
import { api } from "../../api";

const ProfileInfoPage = () => {
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const accountData = await api.getAccount();
                if (accountData && accountData.usuario) {
                    // Merge account data (alias, cvu) with user data
                    // and map fields to match ProfileSection expectations
                    const fullProfile = {
                        ...accountData.usuario,
                        nombre: accountData.usuario.first_name,
                        apellido: accountData.usuario.last_name,
                        alias: accountData.alias,
                        cbu: accountData.cvu, // ProfileSection expects 'cbu', backend sends 'cvu'
                        saldo: accountData.saldo,
                        estado_verificacion: accountData.estado_verificacion
                    };
                    setUsuario(fullProfile);
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <SidebarLayout>
                <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
            </SidebarLayout>
        );
    }

    return (
        <SidebarLayout>
            <div className="mt-10 mb-16">
                {usuario ? (
                    <ProfileSection usuario={usuario} />
                ) : (
                    <div className="text-center text-gray-500">No se pudo cargar la información del perfil.</div>
                )}
            </div>            
        </SidebarLayout>
    )
};

export default ProfileInfoPage;
