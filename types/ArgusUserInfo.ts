import { ArgusPermissions } from './ArgusPermissions';
import { User } from '@prisma/client';
export interface ArgusUserInfo {
  permissions: ArgusPermissions;
  user?: User;
}
