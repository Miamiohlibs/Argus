import logger from '@/lib/logger';
import { getProject } from '@/app/actions/projectActions';
import { auth } from '@clerk/nextjs/server';
import { getCurrentUser } from '@/app/actions/getUser';
import type { ArgusPermissions } from '@/types/ArgusPermissions';

export default async function getPermissions(
  projectId?: number | string
): Promise<ArgusPermissions> {
  const perms = {
    isBasicUser: false,
    isEditorOrAbove: false,
    isAdmin: false,
    isSuperAdmin: false,
    canPrint: false,
    canEdit: false, // requires projectId
    isOwner: false, // requires projectId
    nonOwnerEditor: false, // requires projectId
  };

  // getUser
  const { user, error: userFetchError } = await getCurrentUser();
  const { userId: clerkUserId } = await auth();

  if (user) {
    // isBasicUser
    perms.isBasicUser = user.role == 'user';

    // isEditorOrAbove
    perms.isEditorOrAbove = ['editor', 'admin', 'superadmin'].includes(
      user.role
    );

    // isAdmin
    perms.isAdmin = ['admin', 'superadmin'].includes(user.role);

    // isSuperAdmin
    perms.isSuperAdmin = user.role === 'superadmin';

    // canPrint: false
    perms.canPrint = user.printSlips;

    if (projectId) {
      const { project, error: projectFetchError } = await getProject({
        id: projectId?.toString(),
      });
      if (project) {
        // isOwner - requires projectId
        perms.isOwner = project.user.clerkUserId == user.clerkUserId;

        // canEdit - requires projectId
        perms.canEdit = perms.isAdmin || perms.isOwner;

        // nonOwnerEditor - requires projectId
        perms.nonOwnerEditor = perms.canEdit && !perms.isOwner;
      }
    }
  } else {
    if (userFetchError) {
      logger.error('Error getting user permissions: ' + userFetchError);
    }
  }
  return perms;
}
