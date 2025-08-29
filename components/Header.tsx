import NextLink from 'next/link';
import { Nav, NavItem, NavLink, Navbar, NavbarBrand } from 'react-bootstrap';
import Image from 'next/image';
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
        <Image
          src={`${process.env.NEXT_PUBLIC_APP_BASEPATH}/peacock-logo.png`}
          alt="Peacock Logo"
          width={40}
          height={40}
        />
        <span className="ps-2">Watson/Argus</span>
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
