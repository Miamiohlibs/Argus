'use client';
import { TableColumn } from 'react-data-table-component';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
// import { User } from '@/types/User';
import { User } from '@prisma/client';
import getUsers from '@/app/actions/getUsers';
import Link from 'next/link';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import createUtilityClassName from 'react-bootstrap/esm/createUtilityClasses';
import { getPossibleCoEditors, addCoEditor } from '@/app/actions/coEditors';
import AddCoEditorButton from './AddCoEditorButton';

export default function CoEditorTable({
  //   user,
  projectId,
}: {
  //   user: User;
  projectId: string;
}) {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');

  // const handleAddCoEditor = async (userId: string) => {
  //   const data = await addCoEditor(userId, projectId);
  // };

  useEffect(() => {
    // Fetch users from an API or other source
    const fetchUsers = async () => {
      const data = await getPossibleCoEditors(projectId); // Assuming getUsers is an async function that fetches users
      setUsers(data ?? []);
      setFilteredUsers(data ?? []);
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
        return <>{row.name}</>;
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
      cell: (row: User) => (
        <>
          <AddCoEditorButton projectId={projectId} userId={row.id} />
        </>
      ),
      ignoreRowClick: true,
    },
  ];
  return (
    <div className="react-data-table" id="users-table">
      <DataTable
        // title="User List"
        columns={columns}
        data={filteredUsers}
        progressPending={loading}
        pagination
        paginationPerPage={25}
        paginationRowsPerPageOptions={[10, 25, 50, 100]}
        highlightOnHover
        striped
        subHeader
        subHeaderComponent={
          <input
            type="text"
            placeholder="Search by name, email, or role"
            aria-label="Search users by name, email, or role"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="p-2 border rounded w-full md:w-1/3"
          />
        }
      />
    </div>
  );
}
