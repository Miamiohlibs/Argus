'use server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import type { Project } from '@prisma/client';

async function getProjects(
  {
    limitToUser,
  }: {
    limitToUser?: boolean;
  } = { limitToUser: true }
): Promise<{
  projects?: Project[];
  error?: string;
}> {
  const { userId } = await auth();
  if (!userId) {
    return { error: 'User not found' };
  }

  try {
    const projects = await db.project.findMany({
      where: {
        ...(limitToUser ? { userId } : {}),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return { projects };
  } catch (error) {
    console.log('DB error:', error);
    return { error: 'Database error' };
  }
}

export default getProjects;
