import { bibHoldingsByAny, bibHoldings } from '@/app/actions/almaSearch';
import { mapAlmaHoldingsToDraft } from './mapper';
import type { SearchableCatalogProvider } from '@/lib/catalogs/types';
import { CATALOG_DISPLAY_NAMES } from '@/lib/catalogs/displayNames';

export const almaProvider: SearchableCatalogProvider = {
  catalog: 'ALMA',
  displayName: CATALOG_DISPLAY_NAMES.ALMA,

  async searchByAny(input: string) {
    const { data, error } = await bibHoldingsByAny(input);
    if (error || !data) {
      return { error: error ?? 'No results found' };
    }
    return { data: mapAlmaHoldingsToDraft(data) };
  },

  async fetchByCatalogId(catalogId: string) {
    const { data, error } = await bibHoldings({ mms_id: catalogId });
    if (error || !data) {
      return { error: error ?? 'No results found' };
    }
    return { data: mapAlmaHoldingsToDraft(data) };
  },
};
