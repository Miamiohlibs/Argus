'use server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import type { PullList } from '@prisma/client';

async function getPullLists(): Promise<{
  pullLists?: PullList[];
  error?: string;
}> {
  const { userId } = await auth();
  if (!userId) {
    return { error: 'User not found' };
  }

  try {
    const pullLists = await db.pullList.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return { pullLists };
  } catch (error) {
    console.log('DB error:', error);
    return { error: 'Database error' };
  }
}

export default getPullLists;
