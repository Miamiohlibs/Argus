'use server';
import logger from '@/lib/logger';
import { db } from '@/lib/db';
import type { ProjectWithUserAndBib } from '@/types/ProjectWithUserAndBib';

async function getProject(params: { id: string }): Promise<{
  project?: ProjectWithUserAndBib;
  error?: string;
}> {
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
    // logger.verbose('Fetched projects:', projects);
    return { project };
  } catch (error) {
    logger.error('DB error:', error);
    return { error: 'Database error' };
  }
}

export default getProject;
