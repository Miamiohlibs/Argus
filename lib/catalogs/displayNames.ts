import type { Catalog } from '@prisma/client';
import type { z } from 'zod';
import { PublicCatalogsSchema } from '@/zod/PublicCatalogsSchema';

let validCatalogs: z.infer<typeof PublicCatalogsSchema> = [];
try {
  validCatalogs = PublicCatalogsSchema.parse(
    JSON.parse(process.env.NEXT_PUBLIC_CATALOGS ?? '[]'),
  );
} catch (error) {
  console.log(
    'Trouble parsing NEXT_PUBLIC_CATALOGS in lib/catalog/displayNames',
  );
  throw error;
}
export const CATALOG_DISPLAY_NAMES: Record<Catalog, string> = {
  ALMA: validCatalogs.find((item) => item.slug == 'ALMA')?.label || 'Alma',
  ASPACE:
    validCatalogs.find((item) => item.slug == 'ASPACE')?.label ||
    'ArchivesSpace',
  CUSTOM: 'Custom Entry',
};
