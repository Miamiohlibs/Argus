'use client';
import { Project } from '@prisma/client';
import { toast } from 'react-toastify';
import deleteProject from '@/app/actions/deleteProject';
import { Button } from 'react-bootstrap';
// import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { on } from 'events';

const DeleteProjectButton = ({
  project,
  onDeleted,
}: {
  project: Project; // Changed semicolon to comma
  onDeleted?: () => void;
}) => {
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
  return (
    <Button
      variant="outline-danger"
      size="sm"
      className="ms-1"
      onClick={() => handleDeleteProject(project.id)}
      disabled={isDeleted} // Disable button if already deleted
      style={{ opacity: isDeleted ? 0.5 : 1 }}
    >
      {isDeleted ? 'Deleted' : 'Delete'}
    </Button>
  );
};

export default DeleteProjectButton;
