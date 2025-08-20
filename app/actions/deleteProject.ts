'use server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import canEdit from '@/lib/canEdit';
// import { unauthorized } from 'next/navigation';

async function deleteProject(projectId: number): Promise<{
  message?: string;
  error?: string;
}> {
  const { userId } = await auth();
  if (!userId) {
    return { error: 'User not found' };
  }
  console.log(`deletion request on project ${projectId} by ${userId}`);
  const isEditor = await canEdit(projectId);
  if (!isEditor) {
    console.log(`deletion permission denied on ${projectId} by ${userId}`);
    // unauthorized();
    return { error: 'Delete permission denied' };
  }

  try {
    await db.project.delete({
      where: {
        id: projectId,
        userId,
      },
    });
    revalidatePath('/');
    return { message: 'Deleted project' };
  } catch (error) {
    console.log('DB error:', error);
    return { error: 'Database error' };
  }
}

export default deleteProject;
