import getUser from '@/app/actions/getUser';
import UserEditForm from '@/components/UserEditForm';
import Link from 'next/link';

export default async function UserEditPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const { user } = await getUser(id);

  if (!user) return <p>User not found</p>;

  return (
    <>
      <Link href="/admin/users" className="btn btn-secondary mb-4">
        Back to Users
      </Link>
      <h1>Edit User Permissions</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h2>{user.name}</h2>
        <p>Email: {user.email}</p>
        <UserEditForm user={user} />
      </div>
    </>
  );
}
