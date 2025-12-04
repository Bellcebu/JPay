import SolicitudPrestamosSection from "../sections/SolicitudPrestamosSection";
import SidebarLayout from "../layouts/SidebarLayout";

const SolicitudPrestamoPage = () => {
    return (
        <SidebarLayout>
            <div className="mt-10 mb-16">
                <SolicitudPrestamosSection />
            </div>            
        </SidebarLayout>
    )
};
export default SolicitudPrestamoPage;