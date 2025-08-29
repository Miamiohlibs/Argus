'use client';
import logger from '@/lib/logger';
import { TableColumn } from 'react-data-table-component';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
// import { User } from '@/types/User';
import { User } from '@prisma/client';
import getUsers from '@/app/actions/getUsers';
import Link from 'next/link';
import { Button } from 'react-bootstrap';
import DeleteButton from './DeleteButton';
import deleteUser from '@/app/actions/deleteUser';
import { toast } from 'react-toastify';

export default function UserTable({
  user,
  canDeleteSuperAdmin,
}: {
  user: User;
  canDeleteSuperAdmin: boolean;
}) {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');

  const handleDelete = async (userIdtoDelete: string) => {
    logger.verbose(`Delete user with ID: ${userIdtoDelete}`);
    const confirmed = window.confirm(
      'Are you sure you want to delete this user and all their projects?'
    );
    if (!confirmed) return;
    const { error } = await deleteUser(userIdtoDelete); // also gets {message}
    if (error) {
      toast.error('Entry deletion failed');
    } else {
      toast.success('Entry deleted successfully');
      const updatedUsers = users.filter((item) => item.id !== userIdtoDelete);
      setUsers(updatedUsers);

      const updatedFilteredUsers = filteredUsers.filter(
        (item) => item.id != userIdtoDelete
      );
      setFilteredUsers(updatedFilteredUsers);
    }
  };

  useEffect(() => {
    // Fetch users from an API or other source
    const fetchUsers = async () => {
      const data = await getUsers(); // Assuming getUsers is an async function that fetches users
      setUsers(data.users ?? []);
      setFilteredUsers(data.users ?? []);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter((user) =>
      [user.name, user.email, user.role].some((val) =>
        val?.toLowerCase().includes(filterText.toLowerCase() || '')
      )
    );
    setFilteredUsers(filtered);
  }, [filterText, users]);

  const columns: TableColumn<User>[] = [
    {
      name: 'Name',
      selector: (row: User) => row.name ?? '',
      cell: (row: User) => {
        let extra;
        if (row.clerkUserId == user.clerkUserId) {
          extra = (
            <Button variant="outline-secondary" size="sm" className="ms-3">
              Self
            </Button>
          );
        }
        return (
          <>
            {row.name}
            {extra}
          </>
        );
      },
      sortable: true,
    },
    {
      name: 'Email',
      selector: (row: User) => row.email ?? '',
      sortable: true,
    },
    {
      name: 'Role',
      selector: (row: User) => row.role ?? '',
      sortable: true,
    },
    {
      name: 'Status',
      selector: (row: User) => row.status ?? '',
      sortable: true,
    },
    {
      name: 'Affiliation',
      selector: (row: User) => row.affiliation ?? '',
      sortable: true,
    },
    {
      name: 'Tools',
      cell: (row: User) =>
        (canDeleteSuperAdmin || row.role !== 'superadmin') &&
        row.clerkUserId !== user.clerkUserId ? (
          <>
            <Link
              href={`/admin/users/edit/${row.id}`} // change path to your route
            >
              <Button className="me-1" variant="outline-primary" size="sm">
                Edit
              </Button>
            </Link>
            <DeleteButton label="" onDelete={() => handleDelete(row.id)} />
          </>
        ) : (
          <></>
        ),
      ignoreRowClick: true,
    },
  ];
  return (
    <DataTable
      title="User List"
      columns={columns}
      data={filteredUsers}
      progressPending={loading}
      pagination
      highlightOnHover
      striped
      subHeader
      subHeaderComponent={
        <input
          type="text"
          placeholder="Search by name, email, or role"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="p-2 border rounded w-full md:w-1/3"
        />
      }
    />
  );
}
