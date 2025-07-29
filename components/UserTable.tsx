'use client';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { User } from '@/types/User';
import getUsers from '@/app/actions/getUsers';

const columns = [
  {
    name: 'Name',
    selector: (row: User) => row.name ?? '',
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
];

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');

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
        val.toLowerCase().includes(filterText.toLowerCase())
      )
    );
    setFilteredUsers(filtered);
  }, [filterText, users]);

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
