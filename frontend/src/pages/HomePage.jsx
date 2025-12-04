import BalanceSection from "../sections/BalanceSection";
import ActivitySection from "../sections/ActivitySection";
import SidebarLayout from "../layouts/SidebarLayout";
import AuthLayout from "../layouts/AuthLayout";

const HomePage = () => {
    return (
        <SidebarLayout>
            <div className="max-w-4xl mx-auto">
                <BalanceSection />
                <ActivitySection />
            </div>
        </SidebarLayout>
    )
};

export default HomePage;