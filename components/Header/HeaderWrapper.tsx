'use server';
import { checkUser } from '@/lib/checkUser';
// import checkAccess from '@/lib/checkAccess';
import getUserInfo from '@/lib/getUserInfo';
import ClientNav from './ClientNav';

export default async function HeaderWrapper() {
  const user = await checkUser();
  const {
    permissions: { isEditorOrAbove, isAdmin },
  } = await getUserInfo();
  //   const hasAdminAccess = await checkAccess({
  //     permittedRoles: ['admin', 'superadmin'],
  //     inline: true,
  //   });

  return <ClientNav user={user} />;
}
