import type {
  CondensedBibHoldings,
  AlmaItemDataPlusHoldingDetails,
  AlmaItemHoldingBibDataPlusCallAndLocation,
} from '@/types/CondensedBibHoldings';
import type { BibDataDraft, ItemDataDraft, CatalogSearchResult } from '@/lib/catalogs/types';

export function mapAlmaBibToDraft(
  bib: AlmaItemHoldingBibDataPlusCallAndLocation,
  totalItems: number,
): BibDataDraft {
  const catalogId = bib.mms_id || null;
  const url =
    catalogId && process.env.ALMA_PERMALINK_BASEURL
      ? process.env.ALMA_PERMALINK_BASEURL + catalogId
      : null;

  return {
    itemTitle: bib.title,
    author: bib.author ?? '',
    catalogId,
    catalogIdType: catalogId ? 'mms_id' : null,
    catalog: 'ALMA',
    callNumber: bib.call_number ?? null,
    notes: null,
    totalItems,
    url,
    pub_date: bib.date_of_publication ?? null,
    publisher: bib.publisher_const ?? null,
    location_codes: bib.location ?? null,
    location_display: bib.locationNames ?? null,
  };
}

export function mapAlmaItemToDraft(
  item: AlmaItemDataPlusHoldingDetails,
): ItemDataDraft {
  const libraryDesc = item.library?.desc;
  const locationDesc = item.location?.desc;
  const location_name =
    libraryDesc && locationDesc && libraryDesc !== locationDesc
      ? `${libraryDesc}: ${locationDesc}`
      : (locationDesc ?? libraryDesc ?? null);

  return {
    clientKey: item.pid || `${item.barcode ?? 'nobarcode'}-${item.copy_id ?? '0'}`,
    description: item.description || null,
    call_number: item.call_number || null,
    copy_id: item.copy_id || null,
    barcode: item.barcode || null,
    location_code: item.location?.value || null,
    location_name,
    box: null,
    folder: null,
    ms: null,
  };
}

export function mapAlmaHoldingsToDraft(
  holdings: CondensedBibHoldings,
): CatalogSearchResult {
  return {
    bibData: mapAlmaBibToDraft(holdings.bib_data, holdings.items.length),
    itemData: holdings.items.map(mapAlmaItemToDraft),
    extra: {
      place_of_publication: holdings.bib_data.place_of_publication,
    },
  };
}
