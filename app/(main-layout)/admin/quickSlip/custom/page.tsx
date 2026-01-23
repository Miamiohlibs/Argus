import checkAccess from '@/lib/checkAccess';
import CustomEntryForm from '@/components/CustomEntryForm';

export default async function quickSlipCustomPage() {
  await checkAccess({ permittedRoles: ['admin', 'superadmin'] });

  return (
    <>
      <h1>Lookup item for Quick Slip</h1>
      <CustomEntryForm quickSlip={true} />
    </>
  );
}
