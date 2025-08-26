import type { Prisma } from '@prisma/client';

// Type for a single entry with its items
export type EntryWithItems = Prisma.BibEntryGetPayload<{
  include: { items: true; project: true };
}>;
