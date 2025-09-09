'use server';
import logger from '@/lib/logger';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import canEdit, { isAdmin } from '@/lib/canEdit';
// import { unauthorized } from 'next/navigation';

async function deleteProject(projectId: number): Promise<{
  message?: string;
  error?: string;
}> {
  const { userId } = await auth();
  if (!userId) {
    return { error: 'User not found' };
  }
  logger.verbose(`deletion request on project ${projectId} by ${userId}`);
  const isEditor = await canEdit(projectId);
  const userIsAdmin = await isAdmin();

  if (!isEditor) {
    logger.verbose(`deletion permission denied on ${projectId} by ${userId}`);
    // unauthorized();
    return { error: 'Delete permission denied' };
  }

  // if admin, don't limit them to deleting own project
  try {
    if (userIsAdmin) {
      await db.project.delete({
        where: {
          id: projectId,
        },
      });
      return { message: 'Deleted project' };
    } else {
      await db.project.delete({
        where: {
          id: projectId,
          userId,
        },
      });
      return { message: 'Deleted project' };
    }
  } catch (error) {
    logger.verbose('DB error:', error);
    return { error: 'Database error' };
  }
}

export default deleteProject;
