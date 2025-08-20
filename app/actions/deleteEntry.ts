'use server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
// import { revalidatePath } from 'next/cache';
import canEdit from '@/lib/canEdit';
import { unauthorized } from 'next/navigation';

async function deleteProject(entryId: string): Promise<{
  message?: string;
  error?: string;
}> {
  const { userId } = await auth();
  if (!userId) {
    return { error: 'User not found' };
  }
  console.log(`deletion request on ${entryId} by ${userId}`);
  const isEditor = await canEdit(entryId);
  if (!isEditor) {
    console.log(`deletion permission denied on ${entryId} by ${userId}`);
    unauthorized();
    return { error: 'Delete permission denied' };
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
