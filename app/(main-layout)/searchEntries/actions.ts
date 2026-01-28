'use server';
import logger from '@/lib/logger';
import { db } from '@/lib/db';
import { isUserAdmin } from '@/lib/getUserInfo';

export interface SearchResult {
  id: string;
  title: string;
  author: string;
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
            { public: true },
          ],
        },
      };

  try {
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

    if (!entries) {
      return { results: [], error: 'BibEntry search failed' };
    }

    const formattedEntries = entries.map((i) => {
      return {
        id: i.id,
        title: i.itemTitle,
        author: i.author,
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
