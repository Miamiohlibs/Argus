'use server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
// import { revalidatePath } from 'next/cache';

async function deleteProject(entryId: string): Promise<{
  message?: string;
  error?: string;
}> {
  const { userId } = await auth();
  if (!userId) {
    return { error: 'User not found' };
  }

  try {
    await db.bibEntry.delete({
      where: {
        id: entryId,
        // userId,
      },
    });
    // revalidatePath('/');
    return { message: 'Deleted entry' };
  } catch (error) {
    console.log('DB error:', error);
    return { error: 'Database error' };
  }
}

export default deleteProject;
