import NextLink from 'next/link';
import { NavItem, NavLink } from 'react-bootstrap';
// import checkAccess from '@/lib/checkAccess';
import { isEditorOrAbove } from '@/lib/canEdit';
const NavEditor = async () => {
  // Check if the user has access to admin features
  const hasAccess = await isEditorOrAbove();
  console.log('NavEditor - hasAccess:', hasAccess);
  if (!hasAccess) {
    return null; // If no access, do not render the admin navigation
  }
  return (
    <>
      {/* <Nav className="me-3"> */}
      <NavItem>
        <NavLink as={NextLink} href="/">
          My Projects
        </NavLink>
      </NavItem>
      {/* </Nav> */}
    </>
  );
};

export default NavEditor;
