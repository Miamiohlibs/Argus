'use server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { checkUser } from '@/lib/checkUser';
// import { redirect } from 'next/navigation';

// import { revalidatePath } from 'next/cache';
// import { redirect } from 'next/navigation';
// import { redirect } from 'next/dist/server/api-utils';

interface ProjectData {
  title: string;
  userId: string;
  notes?: string;
}

interface ProjectResult {
  data?: ProjectData;
  error?: string;
}

export async function createProject(
  prevState: any,
  formData: FormData
): Promise<ProjectResult> {
  try {
    const user = await checkUser();
    if (!user) {
      return { error: 'User not authenticated' };
    }

    const titleValue = formData.get('title');
    //   const ownerValue = formData.get('userId');
    const notesValue = formData.get('notes') ?? '';
    // check for input values
    if (!titleValue || titleValue === '') {
      return { error: 'Title or owner is missing' };
    }
    const title: string = titleValue.toString(); // ensure text is a string
    //   const userId: string = ownerValue.toString();
    const notes: string = notesValue.toString();

    // get logged in user
    const { userId } = await auth();
    console.log(userId);

    // check for user
    if (!userId) {
      return { error: 'User not found' };
    }

    try {
      // First, verify that the user exists in the database
      const existingUser = await db.user.findUnique({
        where: { clerkUserId: userId },
      });

      if (!existingUser) {
        console.log(`User with clerkUserId ${userId} not found in database`);
        return {
          error:
            'User not found in database. Please ensure you are logged in properly.',
        };
      }

      // console.log({
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

      console.log('Created PullList with user relationship:', {
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

      const projectData: ProjectData = {
        title: created.title,
        userId: created.userId,
        notes: created.notes ?? undefined,
      };
      // revalidatePath('/');
      // redirect('/'); // Redirect to the home page after adding the project
      return { data: projectData };
    } catch (error) {
      console.error('Error creating Project:', error);
      return { error: 'Project not added: ' + JSON.stringify(error) };
    }
  } catch (error) {
    console.error('Error creating project:', error);
    return { error: 'Failed to create project' };
  }
}

export async function updateProject(prevState: any, formData: FormData) {
  console.log('starting UpdateProject...');
  try {
    const user = await checkUser();
    if (!user) {
      return { error: 'User not authenticated' };
    }

    const projectId = formData.get('projectId') as string;
    const title = formData.get('title') as string;
    const notes = formData.get('notes') as string;

    // Check if user owns the project
    const existingProject = await db.project.findUnique({
      where: { id: parseInt(projectId) },
    });

    console.log('found existing project: ', existingProject);

    if (!existingProject) {
      console.log('Project not found');
      return { error: 'Project not found' };
    }

    if (existingProject?.userId !== user.clerkUserId) {
      console.log(`${existingProject?.userId} !== ${user.clerkUserId}`);
      return { error: 'Not authorized' };
    }

    const updatedProject = await db.project.update({
      where: { id: parseInt(projectId) },
      data: {
        title,
        notes: notes || null,
      },
    });
    console.log('returning updated project');
    return { data: updatedProject };
  } catch (error) {
    console.error('Error updating project:', error);
    return { error: 'Failed to update project' };
  }
}
