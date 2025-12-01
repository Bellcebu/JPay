import AuthLayout from "../layouts/AuthLayout";
import ProfileSection from "../sections/ProfileSection";
import SidebarLayout from "../layouts/SidebarLayout";

const usuarioMock = {
  nombre: "Ariana",
  apellido: "Méndez",
  dni: 12345678,
  fecha_nacimiento: "2000-01-01",
  telefono: "2984-123456",
  email: "ari@example.com",
  estado_verificacion: "No verificado",
};

const ProfilePage = () => {
    return (
        
            <SidebarLayout>
                <div className="mt-10 mb-16">
                        <ProfileSection usuario={usuarioMock} />
                </div>            
            </SidebarLayout>
            
    )
};

export default ProfilePage;