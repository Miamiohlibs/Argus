import type { SearchableCatalogProvider } from '@/lib/catalogs/types';
import { CATALOG_DISPLAY_NAMES } from '@/lib/catalogs/displayNames';
import { searchByUrl, getClient } from '@/app/actions/aspaceSearch';
const NOT_IMPLEMENTED = 'ArchivesSpace integration is not yet implemented.';
import { PublicCatalogsSchema } from '@/zod/PublicCatalogsSchema';
import logger from '@/lib/logger';
// import { bibHoldings } from '@/app/actions/almaSearch';
// import { bibHoldingsByUri } from '@/app/actions/aspaceSearch';

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

  async fetchByCatalogId(catalogId: string) {
    try {
      const client = await getClient();
      const url = client.baseUrl + catalogId;
      const data = await searchByUrl(url, client);
      if (data == undefined) {
        return { error: 'Unable to fetchByCatalogId in aspace/provider' };
      }
      return { data: { bibData: data.bibData, itemData: data.itemData || [] } };
    } catch (error) {
      logger.error('Failed to fetchByCatalogId in aspace/provider');
      return { error: 'Failed to fetchByCatalogId in aspace/provider' };
    }
  },
};
