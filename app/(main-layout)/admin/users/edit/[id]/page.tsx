import { Metadata } from 'next';
import getUser from '@/app/actions/getUser';
import UserEditForm from '@/components/UserEditForm';
import Link from 'next/link';
import checkAccess from '@/lib/checkAccess';
import getUserInfo from '@/lib/getUserInfo';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Manage User | Argus',
    description: 'Manage individual user permissions',
  };
}

export default async function UserEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await checkAccess({ permittedRoles: ['admin', 'superadmin'] });

  const { id } = await params;
  const { user: userToEdit } = await getUser(id);
  if (!userToEdit) return <p>User not found</p>;
  const { permissions } = await getUserInfo();
  const actorIsSuperAdmin = permissions.isSuperAdmin;

  return (
    <>
      <Link href="/admin/users" className="btn btn-secondary mb-4">
        Back to Users
      </Link>
      <h1 className="h2">Edit User</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h2 className="h3">{userToEdit.name}</h2>
        <p>Email: {userToEdit.email}</p>
        <UserEditForm
          user={userToEdit}
          actorIsSuperAdmin={actorIsSuperAdmin ?? false}
        />
      </div>
    </>
  );
}
