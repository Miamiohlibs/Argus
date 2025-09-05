'use server';
import logger from '@/lib/logger';

import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import type { Prisma } from '@prisma/client';

// Define the type that matches what you're actually returning
type ProjectWithUser = Prisma.ProjectGetPayload<{
  include: { user: true };
}>;

async function getProjects(
  {
    limitToUser,
  }: {
    limitToUser?: boolean;
  } = { limitToUser: true }
): Promise<{
  projects?: ProjectWithUser[];
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
      include: {
        user: true, // Include user details if needed
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    // logger.verbose('Fetched projects:', projects);
    return { projects };
  } catch (error) {
    logger.error('DB error:', error);
    return { error: 'Database error' };
  }
}

export default getProjects;
