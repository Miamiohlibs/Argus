import RecordSearchForm from '@/components/RecordSearchForm';
import checkAccess from '@/lib/checkAccess';

export default async function quickSlipAlmaPage() {
  await checkAccess({ permittedRoles: ['admin', 'superadmin'] });

  return (
    <>
      <h1>Lookup item for Quick Slip</h1>
      <RecordSearchForm quickSlip={true} />
    </>
  );
}
