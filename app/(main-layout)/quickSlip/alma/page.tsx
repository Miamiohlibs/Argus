import RecordSearchForm from '@/components/RecordSearchForm';
import { getCurrentUser } from '@/app/actions/getUser';
import { getPermissions } from '@/lib/getUserInfo';
import { redirect } from 'next/navigation';
import type { Catalog } from '@prisma/client';
import { CATALOG_DISPLAY_NAMES } from '@/lib/catalogs/displayNames';
import { CATALOG_SEARCH_PLACEHOLDER } from '@/lib/catalogs/displayNames';

const resolvedCatalog: Catalog = 'ALMA';

export default async function quickSlipAlmaPage() {
  const user = await getCurrentUser();
  const { canPrint } = await getPermissions(user);
  if (!canPrint) {
    redirect('/');
  }

  if (user.user) {
    return (
      <>
        <h1>Lookup item for Quick Slip</h1>
        <RecordSearchForm
          quickSlip={true}
          catalog="ALMA"
          searchPlaceholder={CATALOG_SEARCH_PLACEHOLDER[resolvedCatalog]}
          user={user.user}
        />
      </>
    );
  }
}
