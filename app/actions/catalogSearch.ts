'use server';
import type { Catalog } from '@prisma/client';
import { getCatalogProvider } from '@/lib/catalogs/registry';
import { isSearchable } from '@/lib/catalogs/types';
import type { CatalogSearchResult } from '@/lib/catalogs/types';
import logger from '@/lib/logger';

export async function searchCatalogByAny(
  catalog: Catalog,
  input: string,
): Promise<{ data?: CatalogSearchResult; error?: string }> {
  const provider = getCatalogProvider(catalog);
  if (!isSearchable(provider)) {
    return { error: `${provider.displayName} does not support search.` };
  }
  return provider.searchByAny(input);
}

export async function fetchCatalogEntry(
  catalog: Catalog,
  catalogId: string,
): Promise<{ data?: CatalogSearchResult; error?: string }> {
  const provider = getCatalogProvider(catalog);
  if (!isSearchable(provider)) {
    return {
      error: `${provider.displayName} does not support catalog refetch.`,
    };
  }
  return provider.fetchByCatalogId(catalogId);
}
