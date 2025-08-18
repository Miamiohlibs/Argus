'use server';
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
      },
    });

    // Ensure every entry has an 'items' array (even if empty)
    const entry: EntryWithItems = {
      ...rawEntry,
      items: rawEntry.items ?? [],
    };

    console.log(`Fetched entry for with id: ${entryId}`);

    return {
      data: entry,
    };
  } catch (error) {
    console.error('DB error fetching entry:', error);
    return { error: 'Failed to fetch entry from database' };
  }
}

export default getEntryById;
