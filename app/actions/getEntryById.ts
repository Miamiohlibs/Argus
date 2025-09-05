'use server';
import logger from '@/lib/logger';
import { db } from '@/lib/db';
import { EntryWithItems } from '@/types/EntryWithItems';

async function getEntryById(entryId: string): Promise<{
  data?: EntryWithItems;
  error?: string;
}> {
  try {
    // Fetch all entries for this project with their items
    const rawEntry = await db.bibEntry.findUniqueOrThrow({
      where: {
        id: entryId,
      },
      include: {
        items: true, // Include related items
        project: true,
      },
    });

    // Ensure every entry has an 'items' array (even if empty)
    const entry: EntryWithItems = {
      ...rawEntry,
      items: rawEntry.items ?? [],
    };

    logger.verbose(`Fetched entry for with id: ${entryId}`);

    return {
      data: entry,
    };
  } catch (error) {
    logger.error('DB error fetching entry:', error);
    return { error: 'Failed to fetch entry from database' };
  }
}

export default getEntryById;
