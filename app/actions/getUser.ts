'use server';
import logger from '@/lib/logger';
import { db } from '@/lib/db';
// import { User } from '@/types/User';
import { User } from '@prisma/client';

export async function getUserByClerkUserId(clerkUserId: string): Promise<{
  user?: User | undefined;
  error?: string;
}> {
  try {
    const user = await db.user.findUniqueOrThrow({
      where: {
        clerkUserId,
      },
    });
    logger.verbose('Fetched user by Clerk ID:', user);
    if (!user || user === null) {
      return { error: 'No user found' };
    }
    return { user };
  } catch (error) {
    logger.error('DB error:', error);
    return { error: 'Database error' };
  }
}

export default async function getUser(id: string): Promise<{
  user?: User | undefined;
  error?: string;
}> {
  try {
    const user = await db.user.findUniqueOrThrow({
      where: {
        id,
      },
    });
    logger.verbose('Fetched user:', user);
    if (!user || user === null) {
      return { error: 'No user found' };
    }
    // Ensure 'name' is string or undefined, not null
    // Ensure 'imageUrl' is string or undefined, not null
    const safeUser = {
      ...user,
      name: user.name ?? undefined,
      imageUrl: user.imageUrl ?? null,
    };
    return { user: safeUser };
  } catch (error) {
    logger.verbose('DB error:', error);
    return { error: 'Database error' };
  }
}
