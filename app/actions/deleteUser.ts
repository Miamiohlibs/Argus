'use server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { isAdmin, isSuperAdmin } from '@/lib/canEdit';

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
  const canDeleteSuperAdmin = await isSuperAdmin();
  if (!canDelete) {
    console.log(
      `user deletion permission denied on ${userIdToDelete} by ${userId}`
    );
    return { error: 'Delete user permission denied' };
  }

  // Array of AND conditions for Prisma where query on db.user.deleteMany.
  // Each object can include any fields from the User type.
  const deleteRequirementsArray: Array<Record<string, string | object>> = [
    { id: userIdToDelete }, // id to delete
    { clerkUserId: { not: userId } }, // don't delete yourself
  ];
  if (!canDeleteSuperAdmin) {
    // admin cannot delete superadmin
    deleteRequirementsArray.push({ role: { not: 'superadmin' } });
  }
  console.log(
    'attempting to delete with requirements:',
    deleteRequirementsArray
  );
  try {
    // this is a bit of a hack: we're not really going to deleteMany
    // only one or zero users will match
    // but deleteMany supports the syntax to prevent the user from deleting themself
    const deletedUsers = await db.user.deleteMany({
      where: {
        AND: deleteRequirementsArray,
      },
    });
    if (deletedUsers.count == 0) {
      throw new Error('No users deleted.');
    }
    return { message: 'Deleted project' };
  } catch (error) {
    console.log('DB error:', error);
    return { error: 'Database error' };
  }
}

export default deleteUser;
