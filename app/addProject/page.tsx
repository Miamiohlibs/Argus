import AddProject from '@/components/AddProject';
import { checkUser } from '@/lib/checkUser';
// import { User } from '@/types/User';
// import type { User } from '@prisma/client';

export default async function AddProjectPage() {
  const currentUser = await checkUser();
  // const currentUser: User | null = await checkUser();

  console.log(currentUser);
  return (
    <>
      <AddProject user={currentUser} />
    </>
  );
}
