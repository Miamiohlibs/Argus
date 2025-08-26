import NextLink from 'next/link';
import { Nav, NavItem, NavLink, Navbar, NavbarBrand } from 'react-bootstrap';
import {
  SignInButton,
  // SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import { checkUser } from '@/lib/checkUser';
import NavEditor from './NavEditor';
import NavAdmin from './NavAdmin';

const Header = async () => {
  const user = await checkUser();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="px-2">
      <NavbarBrand as={NextLink} href="/">
        Watson/Argus
      </NavbarBrand>
      <Nav className="ms-auto me-3 text-light">
        <NavEditor />
        <NavItem>
          <NavLink as={NextLink} href="/allProjects">
            All Projects
          </NavLink>
        </NavItem>
        <NavAdmin />
        <SignedOut>
          <NavItem>
            <SignInButton />
          </NavItem>
        </SignedOut>
        <SignedIn>
          <p className="text-light">{user?.name}</p> <UserButton />
        </SignedIn>
      </Nav>
    </Navbar>
  );
};

export default Header;
