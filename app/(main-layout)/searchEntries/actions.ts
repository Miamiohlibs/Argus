'use server';
import logger from '@/lib/logger';
import { db } from '@/lib/db';
import { isUserAdmin } from '@/lib/getUserInfo';

export interface SearchResult {
  id: string;
  title: string;
  projectId: number;
  projectName: string;
  user: string;
}

export interface SearchState {
  results: SearchResult[];
  error: string | null;
}

export async function searchAction(
  prevState: SearchState,
  formData: FormData
): Promise<SearchState> {
  const query = formData.get('q')?.toString().trim();
  const userId = formData.get('userId')?.toString().trim();
  const isAdmin = userId && (await isUserAdmin(userId));

  console.log(`User is admin: ${isAdmin}`);

  if (!query) {
    return {
      results: [],
      error: 'Please enter a search term',
    };
  }

  const limitToUser = isAdmin
    ? {}
    : {
        project: {
          OR: [
            { user: { id: userId } },
            { coEditors: { some: { id: userId } } },
          ],
        },
      };

  try {
    console.log(query, userId);
    const entries = await db.bibEntry.findMany({
      where: {
        OR: [
          { itemTitle: { contains: query, mode: 'insensitive' } },
          { author: { contains: query, mode: 'insensitive' } },
        ],
        ...limitToUser,
      },
      include: {
        project: {
          include: { user: true },
        },
      },
    });
    logger.verbose('Fetched entries:', entries);
    console.log('Fetched entries:', entries);

    if (!entries) {
      return { results: [], error: 'BibEntry search failed' };
    }

    const formattedEntries = entries.map((i) => {
      return {
        id: i.id,
        title: i.itemTitle,
        projectId: i.project.id,
        projectName: i.project.title,
        user: i.project.user.name,
      };
    });
    return {
      results: formattedEntries,
      error: '',
    };
  } catch (error) {
    logger.error('DB error:', error);
    return { results: [], error: 'Database error' };
  }
}
