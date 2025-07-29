'use client';

import dynamic from 'next/dynamic';

const UserTable = dynamic(() => import('./UserTable'), {
  ssr: false,
});

export default function UserTableWrapper() {
  return <UserTable />;
}
