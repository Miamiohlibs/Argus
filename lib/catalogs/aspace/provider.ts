import type { SearchableCatalogProvider } from '@/lib/catalogs/types';
import { CATALOG_DISPLAY_NAMES } from '@/lib/catalogs/displayNames';
import { searchByUrl, getClient } from '@/app/actions/aspaceSearch';
const NOT_IMPLEMENTED = 'ArchivesSpace integration is not yet implemented.';

export const aspaceProvider: SearchableCatalogProvider = {
  catalog: 'ASPACE',
  displayName: CATALOG_DISPLAY_NAMES.ASPACE,

  async searchByAny(input: string) {
    const client = await getClient();
    await searchByUrl(input, client);
    return { error: NOT_IMPLEMENTED };
  },

  async fetchByCatalogId() {
    return { error: NOT_IMPLEMENTED };
  },
};
