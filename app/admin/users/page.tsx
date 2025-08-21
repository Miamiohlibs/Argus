import UserTableWrapper from '@/components/UserTableWrapper';
// import getUserRole from '../../actions/getUserRole';
// import { redirect } from 'next/navigation';
import checkAccess from '@/lib/checkAccess';
import { checkUser } from '@/lib/checkUser';

export default async function UsersPage() {
  await checkAccess({ permittedRoles: ['admin', 'superadmin'] });
  const user = await checkUser();
  const canDeleteSuperAdmin = user?.role == 'superadmin'; // true if user is superadmin

  if (!user) {
    return;
  }
  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-4">User List</h1>
      <UserTableWrapper user={user} canDeleteSuperAdmin={canDeleteSuperAdmin} />
    </main>
  );
}
