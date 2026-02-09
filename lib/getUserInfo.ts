import logger from '@/lib/logger';
import { getProject } from '@/app/actions/projectActions';
import { getCurrentUser } from '@/app/actions/getUser';
import type { ArgusPermissions } from '@/types/ArgusPermissions';
import type { ArgusUserInfo } from '@/types/ArgusUserInfo';
import type { User } from '@prisma/client';
import { db } from './db';

export default async function getUserInfo(
  projectId?: number | string,
): Promise<ArgusUserInfo> {
  const { user, error: userFetchError } = await getCurrentUser();
  const permissions = await getPermissions({ projectId, user });
  return { permissions, user };
}

export async function getPermissions({
  projectId,
  user,
}: {
  projectId?: number | string;
  user?: User;
}): Promise<ArgusPermissions> {
  const perms = {
    isBasicUser: false,
    isEditorOrAbove: false,
    isAdmin: false,
    isSuperAdmin: false,
    canPrint: false,
    canEdit: false, // requires projectId
    isOwner: false, // requires projectId
    isCoEditor: false, // requires projectId
    isOwnerish: false, // requires projectId == isOwner || isEditor
    nonOwnerEditor: false, // requires projectId
  };

  if (user) {
    // isBasicUser
    perms.isBasicUser = user.role == 'user';

    // isEditorOrAbove
    perms.isEditorOrAbove = ['editor', 'admin', 'superadmin'].includes(
      user.role,
    );

    // isAdmin
    perms.isAdmin = ['admin', 'superadmin'].includes(user.role);

    // isSuperAdmin
    perms.isSuperAdmin = user.role === 'superadmin';

    // canPrint: false
    perms.canPrint = user.printSlips || perms.isAdmin;

    if (projectId) {
      const { project, error: projectFetchError } = await getProject({
        id: projectId?.toString(),
      });
      if (project) {
        // isOwner - requires projectId
        perms.isOwner = project.user.clerkUserId == user.clerkUserId;

        // isCoeditor
        const coEditorsArr = project.coEditors.map((ed) => ed.clerkUserId);
        perms.isCoEditor = coEditorsArr.includes(user.clerkUserId);

        // canEdit - requires projectId
        perms.canEdit = perms.isAdmin || perms.isOwner || perms.isCoEditor;

        // isOwnerish can perform owner roles that co-editors can't
        perms.isOwnerish = perms.isAdmin || perms.isOwner;

        // nonOwnerEditor - requires projectId
        // weirdly, co-editors are *not* nonOwnerEditors for this purpose
        perms.nonOwnerEditor =
          perms.canEdit && !perms.isOwner && !perms.isCoEditor;
      }
    }
  }
  return perms;
}

export async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    const user = await db.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
    });
    console.log(`Current User: ${JSON.stringify(user)}`);
    return user?.role != null && ['admin', 'superadmin'].includes(user.role);
  } catch (error) {
    logger.error(
      `Error getting user "${userId}" in getUserInfo.isUserAdmin: ${error}`,
    );
    return false;
  }
}
