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
