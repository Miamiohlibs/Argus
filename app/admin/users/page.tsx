import UserTableWrapper from '@/components/UserTableWrapper';
import getUserRole from '../../actions/getUserRole';
import { redirect } from 'next/navigation';
import checkAccess from '@/lib/checkAccess';
export default async function UsersPage() {
  await checkAccess(['admin', 'superadmin']);

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-4">User List</h1>
      <UserTableWrapper />
    </main>
  );
}
