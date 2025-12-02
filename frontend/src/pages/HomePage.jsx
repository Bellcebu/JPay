import BalanceSection from "../sections/BalanceSection";
import SidebarLayout from "../layouts/SidebarLayout";
import AuthLayout from "../layouts/AuthLayout";
import ActivitySection from "../sections/ActivitySection";
const HomePage = () => {
    return (
        <SidebarLayout>
            <BalanceSection />
            <ActivitySection/>
        </SidebarLayout>
       
    )
};

export default HomePage;