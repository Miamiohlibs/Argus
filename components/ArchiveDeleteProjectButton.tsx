'use client';

import { Project } from '@prisma/client';
import { toast } from 'react-toastify';
import {
  updateProjectStatus,
  deleteProject,
} from '@/app/actions/projectActions';

import { Dropdown, Button, ButtonGroup } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';
import { useEffect, useState } from 'react';

const ArchiveDeleteProjectButton = ({
  project,
  onArchived,
  onUnarchived,
  onDeleted,
  showingArchive,
}: {
  project: Project;
  onArchived?: () => void;
  onUnarchived?: () => void;
  onDeleted?: (event?: React.MouseEvent) => void;
  showingArchive: boolean;
}) => {
  const [isArchived, setIsArchived] = useState(false);
  const [isUnarchived, setIsUnarchived] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const handleDeleteProject = async (
    projectId: number,
    event?: React.MouseEvent
  ) => {
    event?.preventDefault();
    event?.stopPropagation();

    const confirmed = window.confirm(
      'Are you sure you want to delete this project FOREVER?'
    );
    if (!confirmed) return;

    const { message, error } = await deleteProject(projectId);
    if (error) {
      toast.error(error);
      return;
    }

    toast.success(message);
    setIsDeleted(true);
    onDeleted?.(event);
  };

  const handleArchiveProject = async (projectId: number) => {
    const confirmed = window.confirm(
      'Are you sure you want to Archive this project?'
    );
    if (!confirmed) return;

    const { error } = await updateProjectStatus({
      projectId,
      status: 'archived',
    });

    if (error) {
      toast.error(error);
      return;
    }

    toast.success('Archived project');
    setIsArchived(true);
    setIsUnarchived(false);
    onArchived?.();
  };

  useEffect(() => {
    setIsArchived(false);
    setIsUnarchived(false);
  }, [showingArchive]);

  const handleUnarchiveProject = async (projectId: number) => {
    const confirmed = window.confirm(
      'Are you sure you want to Unarchive this project?'
    );
    if (!confirmed) return;

    const { error } = await updateProjectStatus({
      projectId,
      status: '',
    });

    if (error) {
      toast.error(error);
      return;
    }

    toast.success('Unarchived project');
    setIsUnarchived(true);
    setIsArchived(false);
    onUnarchived?.();
  };

  let firstButtonColor = 'danger';
  let firstButtonVerb = 'Archive';
  let firstButtonAction = handleArchiveProject;

  if (showingArchive) {
    firstButtonColor = 'success';
    firstButtonVerb = 'Unarchive';
    firstButtonAction = handleUnarchiveProject;
  }

  return (
    <ButtonGroup className="flex-nowrap">
      <Button
        variant={`outline-${firstButtonColor}`}
        size="sm"
        className="ms-1"
        onClick={(e) => firstButtonAction(project.id)}
        disabled={isArchived || isUnarchived || isDeleted}
      >
        {isDeleted ? 'Deleted' : firstButtonVerb}
        {(isArchived || isUnarchived) && !isDeleted && 'd'}
      </Button>

      <Dropdown as={ButtonGroup}>
        <Dropdown.Toggle
          variant="outline-danger"
          size="sm"
          disabled={isArchived || isUnarchived || isDeleted}
        >
          <Trash />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={(e) => handleDeleteProject(project.id, e)}>
            <span className="text-danger">Permanently Delete Project</span>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </ButtonGroup>
  );
};

export default ArchiveDeleteProjectButton;
