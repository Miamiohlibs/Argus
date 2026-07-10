import type { Catalog } from '@prisma/client';
import type { CatalogProvider } from './types';
import { almaProvider } from './alma/provider';
import { aspaceProvider } from './aspace/provider';
import { customProvider } from './custom/provider';

const registry: Record<Catalog, CatalogProvider> = {
  ALMA: almaProvider,
  ASPACE: aspaceProvider,
  CUSTOM: customProvider,
};

export function getCatalogProvider(catalog: Catalog): CatalogProvider {
  const provider = registry[catalog];
  if (!provider) {
    throw new Error(`No catalog provider registered for "${catalog}"`);
  }
  return provider;
}
