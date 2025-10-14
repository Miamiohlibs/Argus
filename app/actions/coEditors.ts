'use server';
import { db } from '@/lib/db';

export async function getPossibleCoEditors(project_id: string) {
  // get users who are:
  // _ not the owner
  // _ not already a co-editor
  // \* role=Editor or above
  const project_id_int = parseInt(project_id);

  const possibleCoEditors = db.user.findMany({
    where: {
      projects: {
        none: {
          id: project_id_int,
        },
      },
      role: {
        not: 'user',
      },
    },
  });
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
