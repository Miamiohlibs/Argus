import logger from '@/lib/logger';
import NextLink from 'next/link';
import checkAccess from '@/lib/checkAccess';
import { NAV_LINK_CLASS } from './navLinkStyles';

const NavAdmin = async () => {
  // Check if the user has access to admin features
  const hasAccess = await checkAccess({
    permittedRoles: ['admin', 'superadmin'],
    inline: true,
  });
  logger.verbose('NavAdmin - hasAccess:', hasAccess);
  if (!hasAccess) {
    return null; // If no access, do not render the admin navigation
  }
  return (
    <>
      <span aria-hidden="true" className="hidden text-white md:inline">
        |
      </span>
      <NextLink href="/allProjects" className={NAV_LINK_CLASS}>
        All Projects
      </NextLink>
      <NextLink href="/admin/users" className={NAV_LINK_CLASS}>
        Users
      </NextLink>
    </>
  );
};

export default NavAdmin;
