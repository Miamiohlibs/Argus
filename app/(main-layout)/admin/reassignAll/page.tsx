'use server';
import { reassignAllAction } from '@/app/actions/reassignAll';
import ReassignAllForm from './ReassignAllForm';
import getUsers from '@/app/actions/getUsers';
import checkAccess from '@/lib/checkAccess';
import Link from 'next/link';
import { buttonClasses } from '@/components/ui/Button';

export default async function ReassignProjectPage() {
  await checkAccess({ permittedRoles: ['admin', 'superadmin'] });
  const { users, error: userError } = await getUsers([
    'editor',
    'admin',
    'superadmin',
  ]);

  if (users) {
    return (
      <>
        <h1>Reassign All Projects of User</h1>
        <Link
          href="/admin/users"
          className={buttonClasses({ variant: 'secondary', className: 'mb-6' })}
        >
          Back to Users
        </Link>
        <ReassignAllForm action={reassignAllAction} users={users} />
      </>
    );
  }
}
