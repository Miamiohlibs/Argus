'use server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import type { Prisma } from '@prisma/client';

// Define the type that matches what you're actually returning
type ProjectWithUserAndBib = Prisma.ProjectGetPayload<{
  include: { user: true; bibEntries: true };
}>;

async function getProject(params: { id: string }): Promise<{
  project?: ProjectWithUserAndBib;
  error?: string;
}> {
  const { userId } = await auth();
  if (!userId) {
    return { error: 'User not found' };
  }

  try {
    const project = await db.project.findUniqueOrThrow({
      where: {
        id: parseInt(params.id, 10),
      },
      include: {
        user: true, // Include user details if needed
        bibEntries: true, // Include related bib entries if needed
      },
    });
    // console.log('Fetched projects:', projects);
    return { project };
  } catch (error) {
    console.log('DB error:', error);
    return { error: 'Database error' };
  }
}

export default getProject;
