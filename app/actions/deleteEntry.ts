'use server';
import logger from '@/lib/logger';
import { db } from '@/lib/db';
import getUserInfo from '@/lib/getUserInfo';
import { updateProjectLastUpdated } from './projectActions';

async function deleteEntry(entryId: string): Promise<{
  message?: string;
  error?: string;
}> {
  const {
    user,
    permissions: { isAdmin },
  } = await getUserInfo();
  if (!user) {
    return { error: 'User not found' };
  }

  logger.verbose(
    `deletion request on ${entryId} by ${
      user.id
    }; isAdmin: ${isAdmin.toString()}`
  );

  // if admin, allow delete regardless of ownership
  try {
    if (isAdmin) {
      const deleteResponse = await db.bibEntry.delete({
        where: {
          id: entryId,
          // userId,
        },
      });
      await updateProjectLastUpdated(deleteResponse.projectId);
    } else {
      // require user == owner
      // find out if project has user
      const bibEntry = await db.bibEntry.findFirst({
        where: {
          id: entryId,
          project: {
            userId: user.clerkUserId, // ensure project belongs to this user
          },
        },
      });

      if (!bibEntry) {
        throw new Error('Not authorized or entry not found');
      }

      //delete entry if no exception throw (if user owns project)
      const deleteResponse = await db.bibEntry.delete({
        where: { id: entryId },
      });

      await updateProjectLastUpdated(deleteResponse.projectId);
    }

    return { message: 'Deleted entry' };
  } catch (error) {
    logger.verbose('DB error:', error);
    return { error: 'Database error' };
  }
}

export default deleteEntry;
