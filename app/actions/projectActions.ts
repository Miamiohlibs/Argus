'use server';
import logger from '@/lib/logger';
import { db } from '@/lib/db';
import getUserInfo from '@/lib/getUserInfo';
import { getPermissions } from '@/lib/getUserInfo';
import type { Prisma } from '@prisma/client';
import { Project } from '@prisma/client';
import type { ProjectWithUserAndBib } from '@/types/ProjectWithUserAndBib';
import entryAction from './addEntry';
import { ItemEntry } from '@prisma/client';
import { redirect } from 'next/navigation';

type ProjectWithUser = Prisma.ProjectGetPayload<{
  include: { user: true; coEditors: true };
}>;

type ProjectActionResult =
  | { success: true; data: Project; error?: never }
  | { success: false; error: string; data?: never };

export async function createProject(
  prevState: unknown,
  formData: FormData,
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
    const subjectString = formData.get('subjects') as string;
    const subjects = [subjectString];
    // const subjectsJson = formData.get('subjects') as string;
    // const subjects = JSON.parse(subjectsJson) || [];
    // console.log('***** subjectString', subjectString);
    // console.log('***** subjects', JSON.stringify(subjects));

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
          `User with clerkUserId ${user.clerkUserId} not found in database`,
        );
        return {
          success: false,
          error:
            'User not found in database. Please ensure you are logged in properly.',
        };
      }

      const created = await db.project.create({
        data: {
          title,
          notes,
          purpose,
          public: publicValue,
          subjects,
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
  // console.log('*** updating project ', projectId);
  const updatedProject = await db.project.update({
    where: { id: projectId },
    data: { updatedAt: new Date() },
  });
}

export async function updateProjectStatus(params: {
  projectId: number;
  status: string | null;
}): Promise<{
  // project?: ProjectWithUserAndBib;
  success: boolean;
  error?: string;
}> {
  logger.verbose(`Updating project status ${JSON.stringify(params)}`);
  // set status to null if empty string
  params.status = params.status == '' ? null : params.status;
  try {
    const updatedProject = await db.project.update({
      where: { id: params.projectId },
      data: {
        status: params.status,
      },
    });
    logger.verbose(`Success updating project status ${JSON.stringify(params)}`);
    return { success: true };
  } catch (error) {
    logger.error('Error in updateProjectStatus:', error);
    return { success: false, error: 'Failed to update project' };
  }
}

export type UpdateProjectOwnerResult =
  | { success: true; error?: never }
  | { success: false; error: string };

export async function updateProjectOwner(
  prevState: UpdateProjectOwnerResult | null,
  formData: FormData,
): Promise<UpdateProjectOwnerResult> {
  // this is used in admin/reassignProject
  const projectId = formData.get('projectId') as string;
  const newOwnerId = formData.get('newOwnerId') as string;
  const adminId = formData.get('thisUserId') as string;

  // logger.verbose(`Updating project owner ${JSON.stringify(formData)}`);

  if (newOwnerId == null)
    return { success: false, error: 'missing newOwnerId' };

  let newOwnerUser;
  try {
    newOwnerUser = await db.user.findUniqueOrThrow({
      where: { id: newOwnerId },
    });
  } catch (error) {
    return {
      success: false,
      error: `Could not find user with id ${newOwnerId}`,
    };
  }

  let adminUser;
  try {
    adminUser = await db.user.findUniqueOrThrow({
      where: { id: adminId, OR: [{ role: 'admin' }, { role: 'superadmin' }] },
    });
  } catch (error) {
    return {
      success: false,
      error: `You are not authorized to reassign a projet.`,
    };
  }

  try {
    const updatedProject = await db.project.update({
      where: { id: parseInt(projectId) },
      data: {
        user: {
          connect: {
            id: newOwnerId,
          },
        },
      },
    });
    logger.verbose(
      `Success updating project owner ${JSON.stringify(formData)}`,
    );
    // return { success: true };
  } catch (error) {
    logger.error('Error in updateProjectStatus:', error);
    return { success: false, error: 'Failed to update project' };
  }
  redirect(`/project/${projectId}`);
}

export async function updateProject(
  prevState: unknown,
  formData: FormData,
): Promise<ProjectActionResult> {
  logger.verbose('starting UpdateProject...');
  try {
    const { user } = await getUserInfo();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }
    const projectId = formData.get('projectId') as string;
    const { isOwner, isCoEditor, isAdmin } = await getPermissions({
      projectId,
      user,
    });
    if (!isOwner && !isCoEditor && !isAdmin) {
      return {
        success: false,
        error: 'User not authorized to perform this action',
      };
    }
    const title = formData.get('title') as string;
    const notes = formData.get('notes') as string;
    const purpose = formData.get('purpose') as string;
    const publicValue = formData.get('public') !== null;
    const subjectString = formData.get('subjects') as string;
    const subjects = [subjectString];
    // const subjectsJson = formData.get('subjects') as string;
    // const subjects = JSON.parse(subjectsJson) || [];
    // console.log('***** subjectString', subjectString);
    // console.log('***** subjects', JSON.stringify(subjects));
    // subjectValue = subjectValue == 'None' ? '' : subjectValue;

    logger.verbose(
      `Data as submitted: projId: ${projectId}, title: ${title}, notes: ${notes}, purpose: ${purpose}, public: ${publicValue}, subjects: ${subjectString}`,
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

    const updatedProject = await db.project.update({
      where: { id: parseInt(projectId) },
      data: {
        title,
        notes: notes || null,
        purpose,
        public: publicValue,
        subjects,
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
    limitToArchived,
  }: {
    limitToUser?: boolean;
    limitToPublic?: boolean;
    limitToArchived?: boolean;
  } = { limitToUser: true, limitToPublic: false, limitToArchived: false },
): Promise<{
  projects?: ProjectWithUser[];
  error?: string;
}> {
  const { user } = await getUserInfo();
  if (!user) {
    return { error: 'User not found' };
  }

  const statusFilter = limitToArchived
    ? { status: 'archived' }
    : { OR: [{ status: { not: 'archived' } }, { status: null }] };

  try {
    // console.log(
    //   `Getting projects; limit to public? ${limitToPublic}; limit to archived: ${limitToArchived}`,
    // );
    let projects;
    if (limitToPublic) {
      projects = await db.project.findMany({
        where: { AND: [statusFilter, { public: true }] },
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
          AND: [
            statusFilter,
            {
              OR: [
                // find all projects with user as owner or as coeditor
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
    logger.verbose('Fetched projects:', projects);
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
    `deletion request on project ${projectId} by ${user.clerkUserId}`,
  );

  if (!canEdit) {
    logger.verbose(
      `deletion permission denied on ${projectId} by ${user.clerkUserId}`,
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
