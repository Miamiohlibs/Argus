'use client';
import { TableColumn } from 'react-data-table-component';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Prisma } from '@prisma/client';
// import { User as ClerkUser } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from 'react-bootstrap';
import { getProjects } from '@/app/actions/projectActions';
import DeleteProjectButton from './DeleteProjectButton';
import { User } from '@prisma/client';
// import canEdit from '@/lib/canEdit';

// Use Prisma's generated type that includes the user relation
type ProjectWithUser = Prisma.ProjectGetPayload<{
  include: { user: true };
}>;

// Define the props interface
interface ProjectsTableProps {
  limitToUser?: boolean;
  user?: User | null;
}

export default function ProjectsTable({
  limitToUser = true,
  user = null,
}: ProjectsTableProps) {
  const [projects, setProjects] = useState<ProjectWithUser[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectWithUser[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');

  // const username = await
  // console.log(`Current user: ${user}`);
  // Normalize the limitToUser prop to ensure consistency
  const normalizedLimitToUser = Boolean(limitToUser);

  const handleDelete = (projectId: number) => (event: React.MouseEvent) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this project?'
    );
    event.stopPropagation(); // prevents script from firing twice
    if (!confirmed) return;

    console.log(`Delete project with ID: ${projectId}`);
    const updatedProjects = projects.filter(
      (project) => project.id !== projectId
    );
    setProjects(updatedProjects);
    setFilteredProjects(updatedProjects);
  };

  // Move columns inside the component so handleDelete is in scope
  const columns: TableColumn<ProjectWithUser>[] = [
    {
      name: 'Title',
      selector: (row: ProjectWithUser) => row.title ?? '',
      cell: (row: ProjectWithUser) => (
        <Link href={`/project/${row.id}`}>
          {row.title || 'Untitled Project'}
        </Link>
      ),
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
      name: 'Tools',
      cell: (row: ProjectWithUser) => {
        // Check if current user can edit this project
        // note: I tried using @/lib/canEdit here and and couldn't get it to work
        const canEditBool =
          user?.role !== 'user' &&
          (user?.role === 'admin' ||
            user?.role === 'superadmin' ||
            row.user.clerkUserId === user?.clerkUserId);
        // logger.verbose(
        //   'Row User:',
        //   row.user?.clerkUserId,
        //   'Current User:',
        //   user?.clerkUserId,
        //   'Can edit:',
        //   canEditBool,
        //   'for project:',
        //   row.title
        // );

        if (!canEditBool) {
          return (
            <>
              <Link
                href={`/slips/${row.id}`}
                className="btn btn-sm btn-outline-primary"
              >
                Print
              </Link>
            </>
          );
        }

        return (
          <>
            <Link
              href={`/editProject/${row.id}`}
              className="me-1 btn btn-outline-primary btn-sm"
            >
              Edit
            </Link>
            <Link
              href={`/slips/${row.id}`}
              className="me-1 btn btn-outline-primary btn-sm"
            >
              Print
            </Link>
            <DeleteProjectButton
              project={row}
              onDeleted={() => handleDelete(row.id)}
            />
          </>
        );
      },
      ignoreRowClick: true,
    },
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await getProjects({ limitToUser: normalizedLimitToUser });
      setProjects(data.projects ?? []);
      setFilteredProjects(data.projects ?? []);
      setLoading(false);
    };

    fetchProjects();
  }, [normalizedLimitToUser]); // Use normalized value for consistent dependency

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
      columns={columns}
      data={filteredProjects}
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
          placeholder="Search projects..."
          value={filterText}
          aria-label="Search projects"
          onChange={(e) => setFilterText(e.target.value)}
          className="p-2 border rounded w-full md:w-1/3"
        />
      }
    />
  );
}
