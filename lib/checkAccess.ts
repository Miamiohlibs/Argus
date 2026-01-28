import logger from '@/lib/logger';
import { redirect } from 'next/navigation';
import getUserRole from '@/app/actions/getUserRole';

type CheckAccessProps = {
  permittedRoles: string[];
  inline?: boolean;
};

// if user doesn't have the right role, send them to the main page
export default async function checkAccess(
  checkAccessProps: CheckAccessProps | string[]
): Promise<string | boolean> {
  // Handle both object and array formats
  const config = Array.isArray(checkAccessProps)
    ? { permittedRoles: checkAccessProps }
    : checkAccessProps;

  const { role } = await getUserRole();
  logger.silly({ role, permittedRoles: config.permittedRoles });
  if (!role || !config.permittedRoles.includes(role)) {
    if (config.inline && config.inline === true) {
      return false; // Return false if inline check is requested
    }
    // Redirect to home if the user does not have access
    redirect('/');
  }
  logger.verbose('User has access with role:', role);
  // Optionally return the role if needed
  return role;
}
