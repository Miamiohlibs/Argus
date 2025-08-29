'use server';
import logger from '@/lib/logger';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

async function getUserRole(): Promise<{
  role?: string;
  error?: string;
}> {
  const { userId } = await auth();
  if (!userId) {
    return { error: 'User not found' };
  }

  try {
    const user = await db.user.findUniqueOrThrow({
      where: { clerkUserId: userId },
    });
    logger.verbose(user.role);
    return { role: user.role };
  } catch (error) {
    logger.verbose('DB error:', error);
    return { error: 'Database error' };
  }
}

export default getUserRole;
