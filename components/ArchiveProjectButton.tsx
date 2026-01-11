'use client';
import { Project } from '@prisma/client';
import { toast } from 'react-toastify';
import { updateProjectStatus } from '@/app/actions/projectActions';
import { Button } from 'react-bootstrap';
// import { useRouter } from 'next/navigation';
import { useState } from 'react';

const ArchiveProjectButton = ({
  project,
  onArchived,
}: {
  project: Project; // Changed semicolon to comma
  onArchived?: () => void;
}) => {
  const [isArchived, setIsArchived] = useState(false);
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
    <Button
      variant="outline-danger"
      size="sm"
      className="ms-1"
      onClick={() => handleArchiveProject(project.id)}
      disabled={isArchived} // Disable button if already Archived
      style={{ opacity: isArchived ? 0.5 : 1 }}
    >
      {isArchived ? 'Archived' : 'Archive'}
    </Button>
  );
};

export default ArchiveProjectButton;
