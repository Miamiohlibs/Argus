'use client';
import { TableColumn } from 'react-data-table-component';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Button } from 'react-bootstrap';
// import { User } from '@prisma/client';
import { getPossibleCoEditors, addCoEditor } from '@/app/actions/coEditors';
import AddCoEditorButton from './AddCoEditorButton';
import { Prisma } from '@prisma/client';

type UserWithCoEditor = Prisma.UserGetPayload<{
  include: { coEditorOn: true; projects: true };
}> & {
  isProjectCoEditor: boolean;
  isProjectOwner: boolean;
};

export default function CoEditorTable({
  projectId,
  currentUserId,
}: {
  projectId: string;
  currentUserId: string;
}) {
  const [users, setUsers] = useState<UserWithCoEditor[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithCoEditor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');

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

  const columns: TableColumn<UserWithCoEditor>[] = [
    {
      name: 'Name',
      selector: (row: UserWithCoEditor) => row.name ?? '',
      cell: (row: UserWithCoEditor) => {
        return <>{row.name}</>;
      },
      sortable: true,
    },
    {
      name: 'Email',
      selector: (row: UserWithCoEditor) => row.email ?? '',
      sortable: true,
    },
    {
      name: 'Role',
      selector: (row: UserWithCoEditor) => row.role ?? '',
      sortable: true,
    },
    {
      name: 'Status',
      selector: (row: UserWithCoEditor) => row.status ?? '',
      sortable: true,
    },
    {
      name: 'Affiliation',
      selector: (row: UserWithCoEditor) => row.affiliation ?? '',
      sortable: true,
    },
    {
      name: 'Tools',
      cell: (row: UserWithCoEditor) => {
        return (
          <>
            {row.role == 'user' ? (
              <Button
                variant="outline-dark"
                size="sm"
                className="ms-1"
                disabled
              >
                "User" role may not be co-editor
              </Button>
            ) : row.isProjectCoEditor ? (
              <Button
                variant="outline-dark"
                size="sm"
                className="ms-1"
                disabled
              >
                Already a co-editor
              </Button>
            ) : row.isProjectOwner ? (
              <Button
                variant="outline-dark"
                size="sm"
                className="ms-1"
                disabled
              >
                Already project owner
              </Button>
            ) : (
              <AddCoEditorButton projectId={projectId} userId={row.id} />
            )}
          </>
        );
      },
      ignoreRowClick: true,
    },
    // (row.coEditorOn.map((proj) => proj.id)).includes(projectId)
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
