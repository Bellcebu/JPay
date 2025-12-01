import AuthLayout from '../layouts/AuthLayout';
import SessionManagement from '../sections/SessionManagement ';
import SidebarLayout from '../layouts/SidebarLayout';

const SessionPage = () => {
  return (
    <SidebarLayout>
      <SessionManagement />
    </SidebarLayout>
  );
};

export default SessionPage;
