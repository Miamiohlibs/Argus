'use server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { isAdmin } from '@/lib/canEdit';

async function deleteUser(userIdToDelete: string): Promise<{
  message?: string;
  error?: string;
}> {
  const { userId } = await auth();
  if (!userId) {
    return { error: 'User not found' };
  }
  console.log(`deletion request for user ${userIdToDelete} by ${userId}`);
  const canDelete = await isAdmin();
  if (!canDelete) {
    console.log(
      `user deletion permission denied on ${userIdToDelete} by ${userId}`
    );
    return { error: 'Delete user permission denied' };
  }

  try {
    await db.user.delete({
      where: {
        id: userIdToDelete,
      },
    });
    return { message: 'Deleted project' };
  } catch (error) {
    console.log('DB error:', error);
    return { error: 'Database error' };
  }
}

export default deleteUser;
