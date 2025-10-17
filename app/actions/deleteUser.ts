'use server';
import logger from '@/lib/logger';
import { db } from '@/lib/db';
import getUserInfo from '@/lib/getUserInfo';

async function deleteUser(userIdToDelete: string): Promise<{
  message?: string;
  error?: string;
}> {
  // const { userId } = await auth();
  const {
    user,
    permissions: { isAdmin, isSuperAdmin },
  } = await getUserInfo();

  if (!user?.clerkUserId) {
    return { error: 'User not found' };
  }
  logger.verbose(
    `deletion request for user ${userIdToDelete} by ${user.clerkUserId}`
  );
  const canDelete = isAdmin;
  const canDeleteSuperAdmin = isSuperAdmin;
  if (!canDelete) {
    logger.verbose(
      `user deletion permission denied on ${userIdToDelete} by ${user.clerkUserId}`
    );
    return { error: 'Delete user permission denied' };
  }

  // Array of AND conditions for Prisma where query on db.user.deleteMany.
  // Each object can include any fields from the User type.
  const deleteRequirementsArray: Array<Record<string, string | object>> = [
    { id: userIdToDelete }, // id to delete
    { clerkUserId: { not: user.clerkUserId } }, // don't delete yourself
  ];
  if (!canDeleteSuperAdmin) {
    // admin cannot delete superadmin
    deleteRequirementsArray.push({ role: { not: 'superadmin' } });
  }
  logger.verbose(
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
    logger.verbose('DB error:', error);
    return { error: 'Database error' };
  }
}

export default deleteUser;
