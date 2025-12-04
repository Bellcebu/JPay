import React from "react";
import SidebarLayout from "../layouts/SidebarLayout";
import ProfileSection from "../sections/ProfileSection";

const usuarioMock = {
  nombre: "Ariana",
  apellido: "Méndez",
  dni: 12345678,
  fecha_nacimiento: "2000-01-01",
  telefono: "2984-123456",
  email: "ari@example.com",
  estado_verificacion: "No verificado",
};

const ProfileInfoPage = () => {
    return (
        <SidebarLayout>
            <div className="mt-10 mb-16">
                <ProfileSection usuario={usuarioMock} />
            </div>            
        </SidebarLayout>
    )
};

export default ProfileInfoPage;
