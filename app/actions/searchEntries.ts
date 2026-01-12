'use server';
import logger from '@/lib/logger';
import { db } from '@/lib/db';
import { BibEntry } from '@prisma/client';
import { Page } from '@react-pdf/renderer';

async function searchEntries(
  query: string,
  userId: string
): Promise<{
  entries?: BibEntry[];
  error?: string;
}> {
  try {
    console.log(query, userId);
    const entries = await db.bibEntry.findMany({
      where: {
        OR: [
          { itemTitle: { contains: query } },
          { author: { contains: query } },
        ],
      },
      include: {
        project: true,
      },
    });
    logger.verbose('Fetched entries:', entries);
    if (!entries) {
      return { error: 'BibEntry search failed' };
    }
    return { entries };
  } catch (error) {
    logger.error('DB error:', error);
    return { error: 'Database error' };
  }
}

export default searchEntries;
