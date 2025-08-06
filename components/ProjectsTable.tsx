'use client';
import { TableColumn } from 'react-data-table-component';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
// import { User } from '@/types/User';
// import { User } from '@prisma/client';
import { Project } from '@prisma/client';
// import getUsers from '@/app/actions/getUsers';
import Link from 'next/link';
import { Button } from 'react-bootstrap';
import getProjects from '@/app/actions/getProjects';

const columns: TableColumn<Project>[] = [
  {
    name: 'Title',
    selector: (row: Project) => row.title ?? '',
    sortable: true,
  },
  {
    name: 'Notes',
    selector: (row: Project) => row.notes ?? '',
    sortable: false,
  },
  {
    name: 'Edit',
    cell: (row: Project) => (
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
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
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
      title="Project List"
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
          placeholder="Search by name, email, or role"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="p-2 border rounded w-full md:w-1/3"
        />
      }
    />
  );
}
