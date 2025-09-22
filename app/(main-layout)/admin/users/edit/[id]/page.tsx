import getUser from '@/app/actions/getUser';
import UserEditForm from '@/components/UserEditForm';
import Link from 'next/link';
import checkAccess from '@/lib/checkAccess';
import { isSuperAdmin } from '@/lib/canEdit';

export default async function UserEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await checkAccess({ permittedRoles: ['admin', 'superadmin'] });

  const { id } = await params;
  const { user } = await getUser(id);
  if (!user) return <p>User not found</p>;
  const actorIsSuperAdmin = await isSuperAdmin();

  return (
    <>
      <Link href="/admin/users" className="btn btn-secondary mb-4">
        Back to Users
      </Link>
      <h1 className="h2">Edit User Permissions</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h2 className="h3">{user.name}</h2>
        <p>Email: {user.email}</p>
        <UserEditForm user={user} actorIsSuperAdmin={actorIsSuperAdmin} />
      </div>
    </>
  );
}
