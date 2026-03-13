import NextLink from 'next/link';
import Link from 'next/link';
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
  SignInButton, // SignUpButton,
  Show,
  UserButton,
} from '@clerk/nextjs';
import { Search } from 'react-bootstrap-icons';
import { User } from '@prisma/client';
// import NavEditor from './NavEditor';
// import NavAdmin from './NavAdmin';

interface PageProps {
  user: User | null | undefined;
}

const ClientNav = async ({ user }: PageProps) => {
  return (
    <Navbar
      bg={process.env.NEXT_PUBLIC_NAV_COLOR || 'dark'}
      variant="dark"
      expand="md"
      className="px-2"
    >
      <NavbarToggle aria-controls="navbarScroll" />
      <Link href={'/'}>
        <NavbarBrand>
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
      </Link>

      <NavbarCollapse id="navbar">
        <Nav className="ms-auto me-3 text-light">
          {/* <NavEditor /> */}
          <Show when="signed-in">
            <NavItem>
              <Link href="/publicProjects" className="nav-link">
                Public Projects
              </Link>
            </NavItem>
          </Show>
          {/* <NavAdmin /> */}
          <Show when="signed-in">
            <NavItem>
              <Link className="nav-link" href="/searchEntries">
                <Search aria-hidden="true" /> Search
              </Link>
            </NavItem>
          </Show>
          <Show when="signed-out">
            <NavItem>
              <SignInButton>
                <div className="btn btn-light">Sign in</div>
              </SignInButton>
            </NavItem>
          </Show>
          <Show when="signed-in">
            <div className="d-flex">
              {user?.name && (
                <NavbarText className="text-light ms-4">
                  {user?.name}
                </NavbarText>
              )}
              <UserButton />
            </div>
          </Show>
        </Nav>
      </NavbarCollapse>
    </Navbar>
  );
};

export default ClientNav;
