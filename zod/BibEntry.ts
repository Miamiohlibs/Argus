import * as z from 'zod';

export const Catalog = z.enum(['ALMA', 'ASPACE', 'CUSTOM']);

export const BibEntry = z.object({
  id: z.string().uuid().optional(),
  itemTitle: z.string(),
  catalogId: z.string().nullable().default(null),
  catalogIdType: z.string().nullable().default(null),
  catalog: Catalog.default('ALMA'),
  author: z.string().default(''),
  callNumber: z.string().nullable().default(null),
  notes: z.string().nullable().default(null),
  projectId: z.number(),
  totalItems: z.number().nullable().default(1),
  url: z.string().nullable().default(null),
  pub_date: z.string().nullable().default(null),
  publisher: z.string().nullable().default(null),
  location_codes: z.string().nullable().default(null),
  location_display: z.string().nullable().default(null),
});

export type BibEntryType = z.infer<typeof BibEntry>;

export const BibEntryDraft = BibEntry.omit({ id: true, projectId: true }).extend({
  projectId: z.number().optional(),
});

export type BibEntryDraftType = z.infer<typeof BibEntryDraft>;
