import type { SearchableCatalogProvider } from '@/lib/catalogs/types';
import { CATALOG_DISPLAY_NAMES } from '@/lib/catalogs/displayNames';
import { searchByUrl, getClient } from '@/app/actions/aspaceSearch';
const NOT_IMPLEMENTED = 'ArchivesSpace integration is not yet implemented.';
import { PublicCatalogsSchema } from '@/zod/PublicCatalogsSchema';

export const aspaceProvider: SearchableCatalogProvider = {
  catalog: 'ASPACE',
  displayName: CATALOG_DISPLAY_NAMES.ASPACE,

  async searchByAny(input: string) {
    try {
      const client = await getClient();
      const data = await searchByUrl(input, client);
      // console.log(`Data (searchByAny): ${JSON.stringify(data)}`);
      if (data) {
        return { data };
      } else {
        return { error: `Failed to get data in aspace/provider/searchByAny` };
      }
    } catch (error) {
      console.error(`Error fetching data in aspace/provider/searchByAny`);
      return { error: `Error fetching data in aspace/provider/searchByAny` };
    }

    // return { error: NOT_IMPLEMENTED };
  },

  async fetchByCatalogId() {
    return { error: NOT_IMPLEMENTED };
  },
};
