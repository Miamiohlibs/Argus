'use server';
import { db } from '@/lib/db';
import type { Prisma } from '@prisma/client';

// Type for a single entry with its items
type EntryWithItems = Prisma.BibEntryGetPayload<{
  include: { items: true };
}>;

// Type for the result we want to return
type EntriesResult = {
  entries: EntryWithItems[];
  totalCount: number;
};

async function getEntries(projectId: string): Promise<{
  data?: EntriesResult;
  error?: string;
}> {
  try {
    // Fetch all entries for this project with their items
    const rawEntries = await db.bibEntry.findMany({
      where: {
        projectId: parseInt(projectId, 10),
      },
      include: {
        items: true, // Include related items
      },
    });

    // Ensure every entry has an 'items' array (even if empty)
    const entries: EntryWithItems[] = rawEntries.map((entry) => ({
      ...entry,
      items: entry.items ?? [],
    }));

    console.log(`Fetched ${entries.length} entries for project ${projectId}`);

    return {
      data: {
        entries,
        totalCount: entries.length,
      },
    };
  } catch (error) {
    console.error('DB error fetching entries:', error);
    return { error: 'Failed to fetch entries from database' };
  }
}

export default getEntries;
