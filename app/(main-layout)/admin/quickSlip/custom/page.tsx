import CustomEntryForm from '@/components/CustomEntryForm';
import { getCurrentUser } from '@/app/actions/getUser';
import { getPermissions } from '@/lib/getUserInfo';
import { redirect } from 'next/navigation';

export default async function quickSlipCustomPage() {
  const user = await getCurrentUser();
  const { canPrint } = await getPermissions(user);
  if (!canPrint) {
    redirect('/');
  }

  return (
    <>
      <h1>Lookup item for Quick Slip</h1>
      <CustomEntryForm quickSlip={true} />
    </>
  );
}
