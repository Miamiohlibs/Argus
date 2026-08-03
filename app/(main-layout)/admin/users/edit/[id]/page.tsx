import { Metadata } from 'next';
import getUser from '@/app/actions/getUser';
import UserEditForm from './UserEditForm';
import Link from 'next/link';
import checkAccess from '@/lib/checkAccess';
import getUserInfo from '@/lib/getUserInfo';
import { buttonClasses } from '@/components/ui/Button';

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
      <Link
        href="/admin/users"
        className={buttonClasses({ variant: 'secondary', className: 'mb-6' })}
      >
        Back to Users
      </Link>
      <h1 className="text-3xl font-medium">Edit User</h1>
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-medium">{userToEdit.name}</h2>
        <p>Email: {userToEdit.email}</p>
        <UserEditForm user={userToEdit} actorIsSuperAdmin={actorIsSuperAdmin} />
      </div>
    </>
  );
}
