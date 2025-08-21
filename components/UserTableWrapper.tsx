'use client';

import dynamic from 'next/dynamic';
import { User } from '@prisma/client';

const UserTable = dynamic(() => import('./UserTable'), {
  ssr: false,
});

export default function UserTableWrapper({
  user,
  canDeleteSuperAdmin,
}: {
  user: User;
  canDeleteSuperAdmin: boolean;
}) {
  return <UserTable user={user} canDeleteSuperAdmin={canDeleteSuperAdmin} />;
}
