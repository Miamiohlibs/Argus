import type { Catalog } from '@prisma/client';
import type { BibEntryDraftType } from '@/zod/BibEntry';
import type { ItemEntryDraftType } from '@/zod/ItemEntry';

export type BibDataDraft = BibEntryDraftType;

export type ItemDataDraft = ItemEntryDraftType & { clientKey: string };

export interface CatalogSearchResult {
  bibData: BibDataDraft;
  itemData: ItemDataDraft[];
  // Catalog-specific display fields with no home in the Argus schema
  // (e.g. Alma's isbn/place_of_publication). Display-only, never persisted.
  extra?: Record<string, string | undefined>;
}

export interface CatalogProvider {
  catalog: Catalog;
  displayName: string;
}

export interface SearchableCatalogProvider extends CatalogProvider {
  searchByAny(
    input: string,
  ): Promise<{ data?: CatalogSearchResult; error?: string }>;
  fetchByCatalogId(
    catalogId: string,
  ): Promise<{ data?: CatalogSearchResult; error?: string }>;
}

export function isSearchable(
  provider: CatalogProvider,
): provider is SearchableCatalogProvider {
  return typeof (provider as SearchableCatalogProvider).searchByAny === 'function';
}
