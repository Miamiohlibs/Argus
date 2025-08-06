'use client';
import { Project } from '@prisma/client';
import { toast } from 'react-toastify';
import deleteProject from '@/app/actions/deleteProject';
import { Button } from 'react-bootstrap';
import { useRouter } from 'next/navigation';

const DeleteProjectButton = ({ project }: { project: Project }) => {
  const router = useRouter();
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
    router.refresh(); // Refresh the page to reflect changes
    // router.push(window.location.pathname);
    window.location.reload();
  };
  return (
    <Button
      variant="outline-danger"
      size="sm"
      onClick={() => handleDeleteProject(project.id)}
    >
      Delete
    </Button>
  );
};

export default DeleteProjectButton;
