import logger from '@/lib/logger';
import NextLink from 'next/link';
import getUserInfo from '@/lib/getUserInfo';
import { NAV_LINK_CLASS } from './navLinkStyles';
const NavEditor = async () => {
  // Check if the user has access to editor features
  const {
    permissions: { isEditorOrAbove },
  } = await getUserInfo();

  logger.verbose('NavEditor - hasAccess:', isEditorOrAbove);
  if (!isEditorOrAbove) {
    return null; // If no access, do not render the editor navigation
  }
  return (
    <NextLink href="/" className={NAV_LINK_CLASS}>
      My Projects
    </NextLink>
  );
};

export default NavEditor;
