'use server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

async function deleteProject(projectId: number): Promise<{
  message?: string;
  error?: string;
}> {
  const { userId } = await auth();
  if (!userId) {
    return { error: 'User not found' };
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
