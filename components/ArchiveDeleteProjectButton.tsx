'use client';
import { Project } from '@prisma/client';
import { toast } from 'react-toastify';
import {
  updateProjectStatus,
  deleteProject,
} from '@/app/actions/projectActions';

import {
  Form,
  Dropdown,
  DropdownButton,
  Button,
  InputGroup,
  ButtonGroup,
} from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';
// import { useRouter } from 'next/navigation';
import { useState } from 'react';

const ArchiveDeleteProjectButton = ({
  project,
  onArchived,
  onDeleted,
}: {
  project: Project; // Changed semicolon to comma
  onArchived?: () => void;
  onDeleted?: () => void;
}) => {
  const [isArchived, setIsArchived] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const handleDeleteProject = async (projectId: number) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this project?'
    );
    if (!confirmed) return;
    const { message, error } = await deleteProject(projectId);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success(message);
    // router.refresh(); // Refresh the page to reflect changes
    // router.push(window.location.pathname);
    setIsDeleted(true); // Hide the row
    onDeleted?.(); // Call the optional callback if provided
  };

  const handleArchiveProject = async (projectId: number) => {
    const confirmed = window.confirm(
      'Are you sure you want to Archive this project?'
    );
    if (!confirmed) return;
    const { success, error } = await updateProjectStatus({
      projectId,
      status: 'archived',
    });
    if (error) {
      toast.error(error);
      return;
    }
    toast.success('Archived project');
    // router.refresh(); // Refresh the page to reflect changes
    // router.push(window.location.pathname);
    setIsArchived(true); // Hide the row
    onArchived?.(); // Call the optional callback if provided
  };

  return (
    <ButtonGroup className="flex-nowrap">
      <Button
        variant="outline-danger"
        size="sm"
        className="ms-1"
        onClick={() => handleArchiveProject(project.id)}
      >
        Archive
      </Button>

      <Dropdown as={ButtonGroup}>
        <Dropdown.Toggle
          variant="outline-danger"
          size="sm"
          id="archive-dropdown"
        >
          <Trash />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item>
            <span
              className="text-danger"
              onClick={() => handleDeleteProject(project.id)}
            >
              Permanently Delete Project
            </span>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </ButtonGroup>
  );
};

export default ArchiveDeleteProjectButton;
