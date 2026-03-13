'use client';
import NextLink from 'next/link';
import Link from 'next/link';
import { NavItem, NavLink } from 'react-bootstrap';
import type { ArgusPermissions } from '@/types/ArgusPermissions';

interface PageProps {
  permissions: ArgusPermissions;
}

const ClientNavEditor = ({ permissions }: PageProps) => {
  if (!permissions.isEditorOrAbove) {
    return null; // If no access, do not render the editor navigation
  }
  return (
    <>
      <NavItem>
        <NavLink as={NextLink} href="/">
          My Projects
        </NavLink>
      </NavItem>
    </>
  );
};

export default ClientNavEditor;
