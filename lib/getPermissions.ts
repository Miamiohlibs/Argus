import logger from '@/lib/logger';
import checkAccess from './checkAccess';
import { getProject } from '@/app/actions/projectActions';
import { currentUser } from '@clerk/nextjs/server';
import { getCurrentUser } from '@/app/actions/getUser';
import type { ProjectWithUserAndBib } from '@/types/ProjectWithUserAndBib';
import type { ArgusPermissions } from '@/types/ArgusPermissions';

export default async function getPermissions(): Promise<ArgusPermissions> {
  const perms = {
    isBasicUser: false,
    isEditorOrAbove: false,
    isAdmin: false,
    isSuperAdmin: false,
    canEdit: false,
    canPrint: false, // requires projectId
    isOwner: false, // requires projectId
    nonOwnerEditor: false, // requires projectId
  };

  // getUser
  const { user, error } = await getCurrentUser();

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

    // canEdit - requires projectId
    // isOwner - requires projectId
    // nonOwnerEditor - requires projectId
  } else {
    if (error) {
      logger.error('Error getting user permissions: ' + error);
    }
  }
  return perms;
}
