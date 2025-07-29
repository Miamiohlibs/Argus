'use server';
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
    console.log(user.role);
    return { role: user.role };
  } catch (error) {
    console.log('DB error:', error);
    return { error: 'Database error' };
  }
}

export default getUserRole;
