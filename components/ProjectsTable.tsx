'use client';
import { TableColumn } from 'react-data-table-component';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Prisma } from '@prisma/client';
import Link from 'next/link';
import { getProjects } from '@/app/actions/projectActions';
import DeleteProjectButton from './DeleteProjectButton';
import { User } from '@prisma/client';

// Use Prisma's generated type that includes the user relation
type ProjectWithUser = Prisma.ProjectGetPayload<{
  include: { user: true };
}>;

// Define the props interface
interface ProjectsTableProps {
  limitToUser?: boolean;
  user?: User | null;
  canPrint?: boolean;
}

export default function ProjectsTable({
  limitToUser = true,
  user = null,
  canPrint = false,
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
      name: 'Purpose',
      selector: (row: ProjectWithUser) => row.purpose,
      sortable: true,
    },
    {
      name: 'Created',
      selector: (row: ProjectWithUser) => new Date(row.createdAt).getTime(),
      cell: (row: ProjectWithUser) =>
        new Date(row.createdAt).toLocaleDateString(),
      sortable: true,
      width: '10em',
    },
    {
      name: 'Updated',
      selector: (row: ProjectWithUser) => new Date(row.updatedAt).getTime(),
      cell: (row: ProjectWithUser) =>
        new Date(row.updatedAt).toLocaleDateString(),
      sortable: true,
      width: '10em',
    },
    {
      name: 'Notes',
      selector: (row: ProjectWithUser) => row.notes ?? '',
      sortable: false,
      wrap: true,
    },
    {
      name: 'Tools',
      cell: (row: ProjectWithUser) => {
        // Have to determine edit permissions line by line
        // can't use the regular getUserInfo().permissions
        // Check if current user can edit this project
        const canEdit =
          user?.role !== 'user' &&
          (user?.role === 'admin' ||
            user?.role === 'superadmin' ||
            row.user.clerkUserId === user?.clerkUserId);

        return (
          <>
            {canEdit && (
              <Link
                href={`/editProject/${row.id}`}
                className="me-1 btn btn-outline-primary btn-sm"
              >
                Edit
              </Link>
            )}
            {canPrint && (
              <Link
                href={`/slips/${row.id}`}
                className="me-1 btn btn-outline-primary btn-sm"
              >
                Print
              </Link>
            )}
            {canEdit && (
              <DeleteProjectButton
                project={row}
                onDeleted={() => handleDelete(row.id)}
              />
            )}
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
      [project.title, project.user.name, project.notes, project.purpose].some(
        (val) => val?.toLowerCase().includes(filterText.toLowerCase() || '')
      )
    );
    setFilteredProjects(filtered);
  }, [filterText, projects]);

  return (
    <div className="react-data-table" id="projects-table">
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
    </div>
  );
}
