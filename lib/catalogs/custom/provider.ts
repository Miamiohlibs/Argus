import type { CatalogProvider } from '@/lib/catalogs/types';
import { CATALOG_DISPLAY_NAMES } from '@/lib/catalogs/displayNames';

// CUSTOM entries are entered by hand (see components/CustomEntryForm.tsx) --
// there is no external system to search or refetch from, so this provider
// intentionally implements only the base CatalogProvider contract.
export const customProvider: CatalogProvider = {
  catalog: 'CUSTOM',
  displayName: CATALOG_DISPLAY_NAMES.CUSTOM,
};
