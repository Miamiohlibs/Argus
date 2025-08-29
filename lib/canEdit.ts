import logger from '@/lib/logger';
import checkAccess from './checkAccess';
import getProject from '@/app/actions/getProject';
import { currentUser } from '@clerk/nextjs/server';
import type { ProjectWithUserAndBib } from '@/types/ProjectWithUserAndBib';

export async function isBasicUser() {
  // 'user' should have no write permissions
  return (
    (await checkAccess({
      permittedRoles: ['user'],
      inline: true,
    })) !== false
  );
}

export async function isEditorOrAbove() {
  return !(await isBasicUser());
}

export async function isAdmin() {
  return (
    (await checkAccess({
      permittedRoles: ['admin', 'superadmin'],
      inline: true,
    })) !== false
  ); // checkAccess will return admin level if not false, so look for not false
}
export async function isSuperAdmin() {
  return (
    (await checkAccess({
      permittedRoles: ['superadmin'],
      inline: true,
    })) !== false
  ); // checkAccess will return admin level if not false, so look for not false
}

export async function isOwner(projectId: number | string): Promise<boolean> {
  //return true if the clerk user id of the user ==
  try {
    const {
      project,
      error: projectError,
    }: {
      project?: ProjectWithUserAndBib;
      error?: string;
    } = await getProject({ id: projectId.toString() });
    if (projectError) {
      throw new Error(`error getting Project ${projectId} from database`);
    }
    if (!project) {
      return false;
    }

    const clerkUser = await currentUser();
    if (!clerkUser) {
      return false;
    }

    const isOwner: boolean = project.userId == clerkUser?.id;
    return isOwner;
  } catch (err) {
    logger.error('error checking editor status', err);
    return false;
  }
}

export default async function canEdit(
  projectId: number | string
): Promise<boolean> {
  return (
    ((await isOwner(projectId)) || (await isAdmin())) &&
    (await isBasicUser()) === false
  );
}
