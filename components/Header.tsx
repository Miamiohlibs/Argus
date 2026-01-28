import NextLink from 'next/link';
import {
  Nav,
  NavItem,
  NavLink,
  Navbar,
  NavbarText,
  NavbarBrand,
  NavbarCollapse,
  NavbarToggle,
} from 'react-bootstrap';
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
    <Navbar
      bg={process.env.NEXT_PUBLIC_NAV_COLOR || 'dark'}
      variant="dark"
      expand="md"
      className="px-2"
    >
      <NavbarToggle aria-controls="navbarScroll" />
      <NavbarBrand as={NextLink} href="/">
        <Image
          src={`${process.env.NEXT_PUBLIC_APP_BASEPATH}/peacock-logo.png`}
          alt="Peacock Logo"
          width={40}
          height={40}
        />
        <span className="ps-2">
          Argus {process.env.NEXT_PUBLIC_NAV_LABEL || ''}
        </span>
      </NavbarBrand>
      <NavbarCollapse id="navbar">
        <Nav className="ms-auto me-3 text-light">
          <NavEditor />
          <SignedIn>
            <NavItem>
              <NavLink as={NextLink} href="/publicProjects">
                Public Projects
              </NavLink>
            </NavItem>
          </SignedIn>
          <NavAdmin />
          <SignedIn>
            <NavItem>
              <NavLink as={NextLink} href="/searchEntries">
                Search
              </NavLink>
            </NavItem>
          </SignedIn>
          <SignedOut>
            <NavItem>
              <SignInButton />
            </NavItem>
          </SignedOut>
          <SignedIn>
            <div className="d-flex">
              {user?.name && (
                <NavbarText className="text-light ms-4">
                  {user?.name}
                </NavbarText>
              )}
              <UserButton />
            </div>
          </SignedIn>
        </Nav>
      </NavbarCollapse>
    </Navbar>
  );
};

export default Header;
