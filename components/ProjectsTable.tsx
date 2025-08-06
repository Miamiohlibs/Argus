'use client';
import { TableColumn } from 'react-data-table-component';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
// import { User } from '@/types/User';
import { Prisma } from '@prisma/client';
// import getUsers from '@/app/actions/getUsers';
import Link from 'next/link';
import { Button } from 'react-bootstrap';
import getProjects from '@/app/actions/getProjects';

// Use Prisma's generated type that includes the user relation
type ProjectWithUser = Prisma.ProjectGetPayload<{
  include: { user: true };
}>;

const columns: TableColumn<ProjectWithUser>[] = [
  {
    name: 'Title',
    selector: (row: ProjectWithUser) => row.title ?? '',
    sortable: true,
  },
  {
    name: 'Owner',
    selector: (row: ProjectWithUser) => row.user.name ?? 'Unknown',
    sortable: true,
  },
  {
    name: 'Created',
    selector: (row: ProjectWithUser) =>
      new Date(row.createdAt).toLocaleDateString(),
    sortable: true,
  },
  {
    name: 'Updated',
    selector: (row: ProjectWithUser) =>
      new Date(row.updatedAt).toLocaleDateString(),
    sortable: true,
  },
  {
    name: 'Notes',
    selector: (row: ProjectWithUser) => row.notes ?? '',
    sortable: false,
  },
  {
    name: 'Edit',
    cell: (row: ProjectWithUser) => (
      <Link
        href={`/admin/projects/edit/${row.id}`} // change path to your route
      >
        <Button variant="outline-primary" size="sm">
          Edit
        </Button>
      </Link>
    ),
    ignoreRowClick: true,
  },
  //   {
  //     name: 'Delete',
  //     cell: (row: User) => (
  //       <button
  //         onClick={() => handleDelete(row.id)}
  //         className="text-red-600 hover:underline"
  //       >
  //         Delete
  //       </button>
  //     ),
  //     ignoreRowClick: true,
  //     allowOverflow: true,
  //     button: true,
  //   },
];

export default function ProjectsTable(
  options: { limitToUser?: boolean } = { limitToUser: true }
) {
  const [projects, setProjects] = useState<ProjectWithUser[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectWithUser[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    // Fetch projects from an API or other source
    const fetchProjects = async () => {
      const data = await getProjects({ limitToUser: options.limitToUser });
      setProjects(data.projects ?? []);
      setFilteredProjects(data.projects ?? []);
      setLoading(false);
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const filtered = projects.filter((project) =>
      [project.title, project.notes].some((val) =>
        val?.toLowerCase().includes(filterText.toLowerCase() || '')
      )
    );
    setFilteredProjects(filtered);
  }, [filterText, projects]);

  return (
    <DataTable
      //   title="Project List"
      columns={columns}
      data={filteredProjects}
      progressPending={loading}
      pagination
      highlightOnHover
      striped
      subHeader
      subHeaderComponent={
        <input
          type="text"
          placeholder="Search projects..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="p-2 border rounded w-full md:w-1/3"
        />
      }
    />
  );
}
