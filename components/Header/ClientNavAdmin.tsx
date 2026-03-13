'use client';
import NextLink from 'next/link';
import Link from 'next/link';
import { NavItem, NavLink } from 'react-bootstrap';
// import checkAccess from '@/lib/checkAccess';
import { ArgusPermissions } from '@/types/ArgusPermissions';

interface PageProps {
  permissions: ArgusPermissions;
}

const ClientNavAdmin = ({ permissions }: PageProps) => {
  // Check if the user has access to admin features
  console.log(JSON.stringify(permissions));
  if (!permissions.isAdmin && !permissions.isSuperAdmin) {
    return null; // If no access, do not render the admin navigation
  }

  return (
    <>
      <NavLink disabled aria-hidden="true" className="d-none d-md-block">
        |
      </NavLink>
      <NavItem>
        <NavLink as={NextLink} href="/allProjects">
          All Projects
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink as={NextLink} href="/admin/users">
          Users
        </NavLink>
      </NavItem>
    </>
  );
};

export default ClientNavAdmin;
