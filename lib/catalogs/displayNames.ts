import type { Catalog } from '@prisma/client';

export const CATALOG_DISPLAY_NAMES: Record<Catalog, string> = {
  ALMA: 'Alma',
  ASPACE: 'ArchivesSpace',
  CUSTOM: 'Custom Entry',
};
