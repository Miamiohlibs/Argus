'use server';
import logger from '@/lib/logger';
import { db } from '@/lib/db';
import { EntryWithItems } from '@/types/EntryWithItems';

type EntriesResult = {
  entries: EntryWithItems[];
  totalCount: number;
};

async function getEntries(
  projectId: string,
  specificBibEntry?: string
): Promise<{
  data?: EntriesResult;
  error?: string;
}> {
  try {
    // Fetch all entries for this project with their items
    const entries = await db.bibEntry.findMany({
      where: {
        projectId: parseInt(projectId, 10),
        // limit to one bib entry if called for:
        ...(specificBibEntry ? { id: specificBibEntry } : {}),
      },
      include: {
        items: true, // Include related items
        project: true,
      },
    });

    // Ensure every entry has an 'items' array (even if empty)
    // const entries: EntryWithItems[] = rawEntries.map((entry) => ({
    //   ...entry,
    //   items: entry.items ?? [],
    // }));

    logger.verbose(
      `Fetched ${entries.length} entries for project ${projectId}`
    );

    return {
      data: {
        entries,
        totalCount: entries.length,
      },
    };
  } catch (error) {
    logger.error('DB error fetching entries:', error);
    return { error: 'Failed to fetch entries from database' };
  }
}

export default getEntries;
