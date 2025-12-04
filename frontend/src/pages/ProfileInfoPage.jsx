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
                const [accountData, userData] = await Promise.all([
                    api.getAccount(),
                    api.getUser()
                ]);

                if (accountData && userData) {
                    const fullProfile = {
                        ...userData,
                        nombre: userData.first_name,
                        apellido: userData.last_name,
                        alias: accountData.alias,
                        cbu: accountData.cvu,
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
