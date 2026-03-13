import * as z from 'zod';

export const ItemEntry = z.object({
  id: z.string(),
  description: z.string().nullable().default(null),
  bibEntryId: z.string().nullable().default(null),
  call_number: z.string().nullable().default(null),
  copy_id: z.string().nullable().default(null),
  barcode: z.string().nullable().default(null),
  location_code: z.string().nullable().default(null),
  location_name: z.string().nullable().default(null),
  box: z.string().nullable().default(null),
  folder: z.string().nullable().default(null),
  ms: z.string().nullable().default(null),
});
