'use server';
import { db } from '@/lib/db';
import type { Prisma } from '@prisma/client';
import { Project } from '@prisma/client';
import type { ProjectWithUserAndBib } from '@/types/ProjectWithUserAndBib';

export type ReassignAllResult =
  | { success: true; error?: never }
  | { success: false; error: string };

export async function reassignAllAction(
  prevState: ReassignAllResult | null,
  formData: FormData,
): Promise<ReassignAllResult> {
  const oldUserId = formData.get('oldUserId')?.toString();
  const newOwnerId = formData.get('newUserId')?.toString();

  try {
    const projects = await db.project.findMany({
      where: {
        user: {
          id: oldUserId,
        },
      },
    });

    for (let i = 0; i < projects.length; i++) {
      const projectId = projects[i].id;
      const response = await db.project.update({
        where: {
          id: projectId,
        },
        data: {
          user: {
            connect: {
              id: newOwnerId,
            },
          },
        },
      });
    }

    return {
      success: true,
    };
  } catch (err) {
    return {
      success: false,
      error: `Failed to update project ownership.`,
    };
  }

  //   return {
  //     success: false,
  //     error: `Unknown error.`,
  //   };
}
