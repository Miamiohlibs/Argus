'use client';

import { Project } from '@prisma/client';
import { toast } from 'react-toastify';
import {
  updateProjectStatus,
  deleteProject,
} from '@/app/actions/projectActions';

import Button, { ButtonGroup } from '@/components/ui/Button';
import Dropdown from '@/components/ui/Dropdown';
import { Trash } from 'react-bootstrap-icons';
import { useState } from 'react';

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
  const [prevShowingArchive, setPrevShowingArchive] = useState(showingArchive);

  // Reset local archive/unarchive state when the showingArchive prop changes
  if (showingArchive !== prevShowingArchive) {
    setPrevShowingArchive(showingArchive);
    setIsArchived(false);
    setIsUnarchived(false);
  }

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

  let firstButtonColor: 'danger' | 'success' = 'danger';
  let firstButtonVerb = 'Archive';
  let firstButtonAction = handleArchiveProject;

  if (showingArchive) {
    firstButtonColor = 'success';
    firstButtonVerb = 'Unarchive';
    firstButtonAction = handleUnarchiveProject;
  }

  return (
    <ButtonGroup>
      <Button
        variant={`outline-${firstButtonColor}`}
        size="sm"
        className="ms-1 relative rounded-r-none focus:z-10"
        onClick={(e) => firstButtonAction(project.id)}
        disabled={isArchived || isUnarchived || isDeleted}
      >
        {isDeleted ? 'Deleted' : firstButtonVerb}
        {(isArchived || isUnarchived) && !isDeleted && 'd'}
      </Button>

      <Dropdown className="-ml-px">
        <Dropdown.Toggle
          variant="outline-danger"
          size="sm"
          className="relative rounded-l-none focus:z-10"
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
