'use client';

import { TableColumn } from 'react-data-table-component';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Prisma } from '@prisma/client';
import Link from 'next/link';
import { getProjects } from '@/app/actions/projectActions';
import ArchiveDeleteProjectButton from './ArchiveDeleteProjectButton';
import { User } from '@prisma/client';
import { Button } from 'react-bootstrap';
import { UnlockFill as Unlocked } from 'react-bootstrap-icons';

// Use Prisma's generated type that includes the user relation
type ProjectWithUser = Prisma.ProjectGetPayload<{
  include: { user: true };
}>;

interface ProjectsTableProps {
  limitToUser?: boolean;
  limitToPublic?: boolean;
  limitToArchived?: boolean;
  user?: User | null;
  canPrint?: boolean;
}

export default function ProjectsTable({
  limitToUser = true,
  limitToPublic = false,
  limitToArchived = false,
  user = null,
  canPrint = false,
}: ProjectsTableProps) {
  const [projects, setProjects] = useState<ProjectWithUser[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectWithUser[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');
  const [archiveView, setArchiveView] = useState<boolean>(limitToArchived);
  const [deletedProjects, setDeletedProjects] = useState<number[]>([]);

  const normalizedLimitToUser = Boolean(limitToUser);

  const handleArchiveView = () => {
    setArchiveView((prev) => !prev);
  };

  const handleDelete = (projectId: number, event?: React.MouseEvent) => {
    event?.preventDefault();
    event?.stopPropagation();

    console.log('Handler entered');
    console.log(`Delete project with ID: ${projectId}`);

    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    setFilteredProjects((prev) => prev.filter((p) => p.id !== projectId));
    setDeletedProjects((prev) => [...prev, projectId]);
  };

  const handleArchive = (projectId: number) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    setFilteredProjects((prev) => prev.filter((p) => p.id !== projectId));
  };

  const handleUnrchive = (projectId: number) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    setFilteredProjects((prev) => prev.filter((p) => p.id !== projectId));
  };

  useEffect(() => {
    console.log('deletedProjects changed:', deletedProjects);
  }, [deletedProjects]);

  const columns: TableColumn<ProjectWithUser>[] = [
    {
      name: 'Title',
      selector: (row) => row.title ?? '',
      cell: (row) => (
        <p>
          <Link href={`/project/${row.id}`}>
            {row.title || 'Untitled Project'}
          </Link>
          {row.public && <Unlocked className="mx-2" />}
        </p>
      ),
      sortable: true,
    },
    {
      name: 'Owner',
      selector: (row) => row.user.name ?? 'Unknown',
      sortable: true,
      width: '12em',
      wrap: true,
    },
    {
      name: 'Purpose',
      selector: (row) => row.purpose,
      sortable: true,
      width: '9em',
    },
    {
      name: 'Subject',
      selector: (row) => row.subjects.join(', ') ?? '',
      sortable: true,
      width: '10em',
      wrap: true,
    },
    {
      name: 'Created',
      selector: (row) => new Date(row.createdAt).getTime(),
      cell: (row) => new Date(row.createdAt).toLocaleDateString(),
      sortable: true,
      width: '7em',
    },
    {
      name: 'Updated',
      selector: (row) => new Date(row.updatedAt).getTime(),
      cell: (row) => new Date(row.updatedAt).toLocaleDateString(),
      sortable: true,
      width: '7em',
    },
    {
      name: 'Notes',
      selector: (row) => row.notes ?? '',
      sortable: false,
      wrap: true,
    },
    {
      name: 'Tools',
      cell: (row) => {
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
              <ArchiveDeleteProjectButton
                project={row}
                onArchived={() => handleArchive(row.id)}
                onUnarchived={() => handleUnrchive(row.id)}
                onDeleted={(e) => handleDelete(row.id, e)}
                showingArchive={archiveView}
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
      const data = await getProjects({
        limitToUser: normalizedLimitToUser,
        limitToPublic,
        limitToArchived: archiveView,
      });
      setProjects(data.projects ?? []);
      setFilteredProjects(data.projects ?? []);
      setLoading(false);
    };

    fetchProjects();
  }, [normalizedLimitToUser, archiveView]);

  useEffect(() => {
    const filtered = projects.filter((project) =>
      [
        project.title,
        project.user.name,
        project.notes,
        project.purpose,
        project.subjects.join(' '),
      ].some((val) => val?.toLowerCase().includes(filterText.toLowerCase()))
    );
    setFilteredProjects(filtered);
  }, [filterText, projects]);

  return (
    <div className="react-data-table" id="projects-table">
      <Button onClick={handleArchiveView} variant="outline-secondary" size="sm">
        Switch to {archiveView ? 'active' : 'archived'} projects
      </Button>

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
            onChange={(e) => setFilterText(e.target.value)}
            className="p-2 border rounded w-full md:w-1/3"
          />
        }
      />
    </div>
  );
}
