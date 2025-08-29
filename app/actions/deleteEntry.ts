'use server';
import logger from '@/lib/logger';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { isAdmin } from '@/lib/canEdit';

async function deleteProject(entryId: string): Promise<{
  message?: string;
  error?: string;
}> {
  const { userId } = await auth();
  if (!userId) {
    return { error: 'User not found' };
  }

  const userIsAdmin = await isAdmin();
  logger.verbose(
    `deletion request on ${entryId} by ${userId}; isAdmin: ${userIsAdmin.toString()}`
  );

  // if admin, allow delete regardless of ownership
  try {
    if (userIsAdmin) {
      await db.bibEntry.delete({
        where: {
          id: entryId,
          // userId,
        },
      });
    } else {
      // require user == owner
      // find out if project has user
      const bibEntry = await db.bibEntry.findFirst({
        where: {
          id: entryId,
          project: {
            userId: userId, // ensure project belongs to this user
          },
        },
      });

      if (!bibEntry) {
        throw new Error('Not authorized or entry not found');
      }

      //delete entry if no exception throw (if user owns project)
      await db.bibEntry.delete({
        where: { id: entryId },
      });
    }

    return { message: 'Deleted entry' };
  } catch (error) {
    logger.verbose('DB error:', error);
    return { error: 'Database error' };
  }
}

export default deleteProject;
