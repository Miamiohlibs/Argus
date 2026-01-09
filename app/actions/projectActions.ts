'use server';
import logger from '@/lib/logger';
import { db } from '@/lib/db';
import getUserInfo from '@/lib/getUserInfo';
import type { Prisma } from '@prisma/client';
import { ProjectData } from '@/types/ProjectData';
import type { ProjectWithUserAndBib } from '@/types/ProjectWithUserAndBib';
import entryAction from './addEntry';
import { ItemEntry } from '@prisma/client';

type ProjectWithUser = Prisma.ProjectGetPayload<{
  include: { user: true; coEditors: true };
}>;

type ProjectActionResult =
  | { success: true; data: ProjectData; error?: never }
  | { success: false; error: string; data?: never };

export async function createProject(
  prevState: unknown,
  formData: FormData
): Promise<ProjectActionResult> {
  try {
    const { user } = await getUserInfo();
    // const user = await checkUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const titleValue = formData.get('title');
    //   const ownerValue = formData.get('userId');
    const notesValue = formData.get('notes') ?? '';
    const purposeValue = formData.get('purpose') ?? 'Other';
    const publicValue = formData.get('public') !== null;
    let subjectValue = formData.get('subject') as string;
    subjectValue = subjectValue == 'None' ? '' : subjectValue;

    // check for input values
    if (!titleValue || titleValue === '') {
      return { success: false, error: 'Title or owner is missing' };
    }
    const title: string = titleValue.toString(); // ensure text is a string
    //   const userId: string = ownerValue.toString();
    const notes: string = notesValue.toString();
    const purpose: string = purposeValue.toString();

    // get logged in user
    logger.verbose(user.clerkUserId);

    // check for user
    if (!user.clerkUserId) {
      return { success: false, error: 'User not found' };
    }

    try {
      // First, verify that the user exists in the database
      const existingUser = await db.user.findUnique({
        where: { clerkUserId: user.clerkUserId },
      });

      if (!existingUser) {
        logger.error(
          `User with clerkUserId ${user.clerkUserId} not found in database`
        );
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
          purpose,
          public: publicValue,
          subject: subjectValue,
          userId: user.clerkUserId,
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

export async function updateProjectLastUpdated(projectId: number) {
  console.log('*** updating project ', projectId);
  const updatedProject = await db.project.update({
    where: { id: projectId },
    data: { updatedAt: new Date() },
  });
}

export async function updateProject(
  prevState: unknown,
  formData: FormData
): Promise<ProjectActionResult> {
  logger.verbose('starting UpdateProject...');
  try {
    const { user } = await getUserInfo();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const projectId = formData.get('projectId') as string;
    const title = formData.get('title') as string;
    const notes = formData.get('notes') as string;
    const purpose = formData.get('purpose') as string;
    const publicValue = formData.get('public') !== null;
    let subjectValue = formData.get('subject') as string;
    subjectValue = subjectValue == 'None' ? '' : subjectValue;

    console.log(
      `Data as submitted: projId: ${projectId}, title: ${title}, notes: ${notes}, purpose: ${purpose}, public: ${publicValue}`
    );
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
        purpose,
        public: publicValue,
        subject: subjectValue,
      },
    });
    logger.verbose('returning updated project');
    return { success: true, data: updatedProject };
  } catch (error) {
    logger.error('Error updating project:', error);
    return { success: false, error: 'Failed to update project' };
  }
}

export async function getProject(params: { id: string }): Promise<{
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
        coEditors: true,
      },
    });
    // logger.verbose('Fetched projects:', projects);
    return { project };
  } catch (error) {
    logger.error('DB error:', error);
    return { error: 'Database error' };
  }
}

export async function getProjects(
  {
    limitToUser,
    limitToPublic,
  }: {
    limitToUser?: boolean;
    limitToPublic?: boolean;
  } = { limitToUser: true, limitToPublic: false }
): Promise<{
  projects?: ProjectWithUser[];
  error?: string;
}> {
  const { user } = await getUserInfo();
  if (!user) {
    return { error: 'User not found' };
  }

  try {
    console.log(`Getting projects; limit to public? ${limitToPublic}`);
    let projects;
    if (limitToPublic) {
      projects = await db.project.findMany({
        where: { public: true },
        include: {
          user: true, // Include user details if needed
          coEditors: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else {
      projects = await db.project.findMany({
        where: {
          OR: [
            {
              ...(limitToUser
                ? { userId: user?.clerkUserId } // is user's own
                : { id: { gt: 0 } }), // if not user-only, show all
            },
            {
              ...(limitToUser
                ? { coEditors: { some: { id: user?.id } } } // is-coeditor
                : { id: { gt: 0 } }), // if not user-only, show all
            },
          ],
        },
        include: {
          user: true, // Include user details if needed
          coEditors: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }
    // logger.verbose('Fetched projects:', projects);
    return { projects };
  } catch (error) {
    logger.error('DB error:', error);
    return { error: 'Database error' };
  }
}

export async function deleteProject(projectId: number): Promise<{
  message?: string;
  error?: string;
}> {
  const {
    user,
    permissions: { canEdit, isAdmin },
  } = await getUserInfo(projectId);
  if (!user) {
    return { error: 'User not found' };
  }
  logger.verbose(
    `deletion request on project ${projectId} by ${user.clerkUserId}`
  );

  if (!canEdit) {
    logger.verbose(
      `deletion permission denied on ${projectId} by ${user.clerkUserId}`
    );
    // unauthorized();
    return { error: 'Delete permission denied' };
  }

  // if admin, don't limit them to deleting own project
  try {
    if (isAdmin) {
      await db.project.delete({
        where: {
          id: projectId,
        },
      });
      return { message: 'Deleted project' };
    } else {
      await db.project.delete({
        where: {
          id: projectId,
          userId: user.clerkUserId,
        },
      });
      return { message: 'Deleted project' };
    }
  } catch (error) {
    logger.verbose('DB error:', error);
    return { error: 'Database error' };
  }
}

export async function duplicateProject(projectId: string) {
  const {
    user,
    permissions: { canEdit },
  } = await getUserInfo(projectId);
  if (!user) {
    return { error: 'User not found' };
  }

  if (!canEdit) {
    return { error: 'Not authorized' };
  }

  try {
    const project = await db.project.findUnique({
      where: { id: parseInt(projectId) },
      include: { bibEntries: true, user: true },
    });

    if (!project) {
      return { error: 'Project not found' };
    }

    const duplicatedProject = await db.project.create({
      data: {
        title: `Copy of ${project.title}`,
        notes: `Copied from ${project.user.name} with notes: ${project.notes}`,
        userId: user.clerkUserId,
      },
    });

    if (!duplicatedProject) {
      return { error: 'Failed to create duplicated project' };
    }

    const bibEntries = await db.bibEntry.findMany({
      where: {
        projectId: project.id,
      },
      include: { items: true },
    });

    const objToAdd = bibEntries.map((entry) => {
      // lose some attributes generated by the database
      // and submit as if new items through addEntry
      const bibDataAsAny: any = { ...entry };
      delete bibDataAsAny.items;
      delete bibDataAsAny.id;
      bibDataAsAny.total_item_count = bibDataAsAny.totalItems;
      bibDataAsAny.project_id = duplicatedProject.id.toString();
      if (bibDataAsAny.almaId && bibDataAsAny.almaIdType == 'mms_id') {
        bibDataAsAny.mms_id = bibDataAsAny.almaId;
      }
      const itemDataAsAny: any[] = entry.items.map((item) => ({ ...item }));
      itemDataAsAny.map((entry) => {
        delete entry.id;
        delete entry.bibEntryId;
        return true;
      });

      return {
        bibData: bibDataAsAny as Record<string, FormDataEntryValue>,
        itemData: itemDataAsAny as ItemEntry[],
        actionType: 'add' as 'add' | 'edit',
      };
    });

    await Promise.all(objToAdd.map((entry) => entryAction(entry)));

    return {
      message: 'Project duplicated successfully',
      data: duplicatedProject,
      success: true,
    };
  } catch (error) {
    logger.error('Error duplicating project:', error);
    return { error: 'Failed to duplicate project' };
  }
}
