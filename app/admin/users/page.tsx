import UserTableWrapper from '@/components/UserTableWrapper';
import getUserRole from '../../actions/getUserRole';
import { redirect } from 'next/navigation';

export default async function UsersPage() {
  const { role } = await getUserRole();

  if (role && !['admin', 'superadmin'].includes(role)) {
    // go to main route if not admin or superadmin
    redirect('/');
  } else {
    return (
      <main className="p-4">
        <h1 className="text-xl font-bold mb-4">User List</h1>
        <UserTableWrapper />
      </main>
    );
  }
}
