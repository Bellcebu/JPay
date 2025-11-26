import BalanceSection from "../sections/BalanceSection";
import SidebarLayout from "../layouts/SidebarLayout";
import AuthLayout from "../layouts/AuthLayout";
const HomePage = () => {
    return (
        <AuthLayout>
            <SidebarLayout>
                <BalanceSection />
            </SidebarLayout>
        </AuthLayout>
    )
};

export default HomePage;