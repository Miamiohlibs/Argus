import { Nav, NavItem, NavLink, Navbar, NavbarBrand } from 'react-bootstrap';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import { checkUser } from '@/lib/checkUser';

const Header = async () => {
  const user = await checkUser();

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <NavbarBrand href="/" className="ml-3">
        Watson/Argus
      </NavbarBrand>
      <Nav className="ms-auto mr-3">
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
