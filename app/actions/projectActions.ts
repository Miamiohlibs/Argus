'use server';
import logger from '@/lib/logger';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { checkUser } from '@/lib/checkUser';
// import { redirect } from 'next/navigation';

// import { revalidatePath } from 'next/cache';
// import { redirect } from 'next/navigation';
// import { redirect } from 'next/dist/server/api-utils';
// import { Project } from '@prisma/client';
import { ProjectData } from '@/types/ProjectData';

type ProjectActionResult =
  | { success: true; data: ProjectData; error?: never }
  | { success: false; error: string; data?: never };

export async function createProject(
  prevState: unknown,
  formData: FormData
): Promise<ProjectActionResult> {
  try {
    const user = await checkUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const titleValue = formData.get('title');
    //   const ownerValue = formData.get('userId');
    const notesValue = formData.get('notes') ?? '';
    // check for input values
    if (!titleValue || titleValue === '') {
      return { success: false, error: 'Title or owner is missing' };
    }
    const title: string = titleValue.toString(); // ensure text is a string
    //   const userId: string = ownerValue.toString();
    const notes: string = notesValue.toString();

    // get logged in user
    const { userId } = await auth();
    logger.verbose(userId);

    // check for user
    if (!userId) {
      return { success: false, error: 'User not found' };
    }

    try {
      // First, verify that the user exists in the database
      const existingUser = await db.user.findUnique({
        where: { clerkUserId: userId },
      });

      if (!existingUser) {
        logger.error(`User with clerkUserId ${userId} not found in database`);
        return {
          success: false,
          error:
            'User not found in database. Please ensure you are logged in properly.',
        };
      }

      // logger.verbose({
      //   data: {
      //     title,
      //     notes,
      //     userId,
      //   },
      //   existingUser: {
      //     id: existingUser.id,
      //     clerkUserId: existingUser.clerkUserId,
      //     email: existingUser.email,
      //   },
      // });

      const created = await db.project.create({
        data: {
          title,
          notes,
          userId,
        },
        include: {
          user: true, // Include the user data to verify the relationship
        },
      });

      logger.verbose('Created PullList with user relationship:', {
        pullListId: created.id,
        title: created.title,
        userId: created.userId,
        connectedUser: created.user
          ? {
              id: created.user.id,
              clerkUserId: created.user.clerkUserId,
              email: created.user.email,
            }
          : null,
      });

      return { success: true, data: created };
    } catch (error) {
      logger.error('Error creating Project:', error);
      return {
        success: false,
        error: 'Project not added: ' + JSON.stringify(error),
      };
    }
  } catch (error) {
    logger.error('Error creating project:', error);
    return { success: false, error: 'Failed to create project' };
  }
}

export async function updateProject(
  prevState: unknown,
  formData: FormData
): Promise<ProjectActionResult> {
  logger.verbose('starting UpdateProject...');
  try {
    const user = await checkUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const projectId = formData.get('projectId') as string;
    const title = formData.get('title') as string;
    const notes = formData.get('notes') as string;

    // Check if user owns the project
    const existingProject = await db.project.findUnique({
      where: { id: parseInt(projectId) },
    });

    logger.verbose('found existing project: ', existingProject);

    if (!existingProject) {
      logger.verbose('Project not found');
      return { success: false, error: 'Project not found' };
    }

    if (existingProject?.userId !== user.clerkUserId) {
      logger.verbose(`${existingProject?.userId} !== ${user.clerkUserId}`);
      return { success: false, error: 'Not authorized' };
    }

    const updatedProject = await db.project.update({
      where: { id: parseInt(projectId) },
      data: {
        title,
        notes: notes || null,
      },
    });
    logger.verbose('returning updated project');
    return { success: true, data: updatedProject };
  } catch (error) {
    logger.error('Error updating project:', error);
    return { success: false, error: 'Failed to update project' };
  }
}
