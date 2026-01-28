import RecordSearchForm from '@/components/RecordSearchForm';
import { getCurrentUser } from '@/app/actions/getUser';
import { getPermissions } from '@/lib/getUserInfo';
import { redirect } from 'next/navigation';

export default async function quickSlipAlmaPage() {
  const user = await getCurrentUser();
  const { canPrint } = await getPermissions(user);
  if (!canPrint) {
    redirect('/');
  }

  return (
    <>
      <h1>Lookup item for Quick Slip</h1>
      <RecordSearchForm quickSlip={true} />
    </>
  );
}
