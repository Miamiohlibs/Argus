import AddPullList from '@/components/AddPullList';
import { checkUser } from '@/lib/checkUser';
import { User } from '@/types/User';

export default async function AddListPage() {
  //   const currentUser = await checkUser();
  const currentUser: User | null = await checkUser();

  console.log(currentUser);
  return (
    <>
      <AddPullList user={currentUser} />
    </>
  );
}
