import getUserRole from '../../actions/getUserRole';
import { redirect } from 'next/navigation';
import UserList from '@/components/UserList';

const UserAdministration = async () => {
  const { role } = await getUserRole();

  if (role && ['admin', 'superadmin'].includes(role)) {
    return (
      <>
        <h1>User Role: {role}</h1>
        <UserList />
      </>
    );
  } else {
    // go to main route /
    redirect('/');
  }
};

export default UserAdministration;
