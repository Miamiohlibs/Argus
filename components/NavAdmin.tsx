import NextLink from 'next/link';
import { NavItem, NavLink } from 'react-bootstrap';
import checkAccess from '@/lib/checkAccess';

const NavAdmin = async () => {
  // Check if the user has access to admin features
  const hasAccess = await checkAccess({
    permittedRoles: ['admin', 'superadmin'],
    inline: true,
  });
  console.log('NavAdmin - hasAccess:', hasAccess);
  if (!hasAccess) {
    return null; // If no access, do not render the admin navigation
  }
  return (
    <>
      {/* <Nav className="me-3"> */}
      <NavItem>
        <NavLink as={NextLink} href="/admin/users">
          Users
        </NavLink>
      </NavItem>
      {/* </Nav> */}
    </>
  );
};

export default NavAdmin;
