'use server';
import logger from '@/lib/logger';
import { db } from '@/lib/db';
import getUserInfo from '@/lib/getUserInfo';
import { updateProjectLastUpdated } from './projectActions';

async function deleteEntry({
  entryId,
  projectId,
}: {
  entryId: string;
  projectId: string;
}): Promise<{
  message?: string;
  error?: string;
}> {
  const {
    user,
    permissions: { isAdmin, isCoEditor, isOwner },
  } = await getUserInfo(projectId);
  if (!user) {
    return { error: 'User not found' };
  }

  logger.verbose(
    `deletion request on ${entryId} by ${
      user.id
    }; isAdmin: ${isAdmin.toString()}`
  );

  // only delete if isAdmin, isOwner, or isCoEditor
  try {
    let deleteResponse = null;
    if (isAdmin || isCoEditor || isOwner) {
      const deleteResponse = await db.bibEntry.delete({
        where: {
          id: entryId,
        },
      });
      await updateProjectLastUpdated(deleteResponse.projectId);
    } else {
      throw new Error('Not authorized to delete');
    }

    if (!entryId) {
      throw new Error(`Entry not found for deletion: ${entryId}`);
    }

    return { message: 'Deleted entry' };
  } catch (error) {
    logger.verbose('DB error:', error);
    return { error: 'Database error' };
  }
}

export default deleteEntry;
