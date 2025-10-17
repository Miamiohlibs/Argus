import logger from '@/lib/logger';
import NextLink from 'next/link';
import { NavItem, NavLink } from 'react-bootstrap';
import getUserInfo from '@/lib/getUserInfo';
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
    <>
      <NavItem>
        <NavLink as={NextLink} href="/">
          My Projects
        </NavLink>
      </NavItem>
    </>
  );
};

export default NavEditor;
