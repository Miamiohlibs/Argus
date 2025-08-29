'use server';
import logger from '@/lib/logger';
import { db } from '@/lib/db';
// import { User } from '@/types/User';
import { User } from '@prisma/client';

async function updateUser(
  id: string,
  data: Partial<User>
): Promise<{ user?: User; error?: string }> {
  try {
    const updatedUser = await db.user.update({
      where: { id },
      data: {
        ...data,
      },
    });
    logger.verbose('Updated user:', updatedUser);
    const safeUser: User = {
      ...updatedUser,
      name: updatedUser.name ?? undefined,
      imageUrl: updatedUser.imageUrl ?? null,
    };
    return { user: safeUser };
  } catch (error) {
    logger.error('DB error:', error);
    return { error: 'Database error' };
  }
}

export default updateUser;
