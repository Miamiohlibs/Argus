import { Nav, NavItem, NavLink, Navbar, NavbarBrand } from 'react-bootstrap';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import AdminNav from './AdminNav';
import { checkUser } from '@/lib/checkUser';

const Header = async () => {
  const user = await checkUser();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="px-2">
      <NavbarBrand href="/">Watson/Argus</NavbarBrand>
      <Nav className="ms-auto me-3 text-light">
        <NavItem>
          <NavLink href="/">My Projects</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="/allProjects">All Projects</NavLink>
        </NavItem>
        <AdminNav />
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
