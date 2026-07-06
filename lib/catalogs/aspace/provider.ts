import type { SearchableCatalogProvider } from '@/lib/catalogs/types';
import { CATALOG_DISPLAY_NAMES } from '@/lib/catalogs/displayNames';

const NOT_IMPLEMENTED = 'ArchivesSpace integration is not yet implemented.';

export const aspaceProvider: SearchableCatalogProvider = {
  catalog: 'ASPACE',
  displayName: CATALOG_DISPLAY_NAMES.ASPACE,

  async searchByAny() {
    return { error: NOT_IMPLEMENTED };
  },

  async fetchByCatalogId() {
    return { error: NOT_IMPLEMENTED };
  },
};
