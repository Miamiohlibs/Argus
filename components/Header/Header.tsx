'use server';
import { checkUser } from '@/lib/checkUser';
// import checkAccess from '@/lib/checkAccess';
import getUserInfo from '@/lib/getUserInfo';
import ClientNav from './ClientNav';

export default async function Header() {
  const user = await checkUser();
  const { permissions } = await getUserInfo();

  return <ClientNav user={user} permissions={permissions} />;
}
