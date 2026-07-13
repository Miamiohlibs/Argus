import { z } from 'zod';

export const PublicCatalogEntry = z.object({
  slug: z.string(),
  label: z.string(),
});

export const PublicCatalogsSchema = PublicCatalogEntry.array();
