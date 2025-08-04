import { redirect } from 'next/navigation';
import getUserRole from '@/app/actions/getUserRole';

export default async function checkAccess(permittedRoles: string[] = []) {
  const { role } = await getUserRole();

  if (!role || !permittedRoles.includes(role)) {
    redirect('/');
  }

  // Optionally return the role if needed
  return role;
}
