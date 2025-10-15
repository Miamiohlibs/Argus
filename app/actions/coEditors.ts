'use server';
import { db } from '@/lib/db';

export async function getPossibleCoEditors(project_id: string) {
  // add field isProjectOwner
  // add field isProjectCoEditor
  const project_id_int = parseInt(project_id);

  const users = await db.user.findMany({
    include: {
      coEditorOn: true,
      projects: true,
    },
  });
  const possibleCoEditors = users.map((user) => ({
    ...user,
    isProjectCoEditor: user.coEditorOn.some(
      (project) => project.id === project_id_int
    ),
    isProjectOwner: user.projects.some(
      (project) => project.id === project_id_int
    ),
  }));

  return possibleCoEditors;
}

export async function addCoEditor(
  userId: string,
  projectId: string
): Promise<{ success: boolean; error?: string }> {
  const project_id_int = parseInt(projectId) ?? null;
  if (isNaN(project_id_int)) {
    return { success: false, error: 'bad project id' };
  }

  try {
    await db.project.update({
      where: {
        id: project_id_int,
      },
      data: {
        coEditors: {
          connect: {
            id: userId,
          },
        },
      },
    });
    return { success: true };
  } catch (error) {
    console.error('Error adding co-editor:', error);
    return { success: false, error: 'Failed to add co-editor' };
  }
}

export async function removeCoEditor(
  userId: string,
  projectId: string
): Promise<{ success: boolean; error?: string }> {
  const project_id_int = parseInt(projectId) ?? null;
  if (isNaN(project_id_int)) {
    return { success: false, error: 'bad project id' };
  }
  try {
    const removalResponse = await db.project.update({
      where: {
        id: project_id_int,
      },
      data: {
        coEditors: {
          disconnect: {
            id: userId,
          },
        },
      },
    });
    console.log(removalResponse);
    return { success: true };
  } catch (error) {
    console.error('Error adding co-editor:', error);
    return { success: false, error: 'Failed to remove co-editor' };
  }
}
