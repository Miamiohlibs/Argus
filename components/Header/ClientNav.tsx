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

      <NavbarCollapse id="navbar"></NavbarCollapse>
    </Navbar>
  );
};

export default ClientNav;
