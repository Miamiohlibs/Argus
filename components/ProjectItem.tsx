'use client';
import { Project } from '@prisma/client';
import { toast } from 'react-toastify';
import deleteProject from '@/app/actions/deleteProject';

const ProjectItem = ({ project }: { project: Project }) => {
  const handleDeleteProject = async (projectId: number) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this project?'
    );
    if (!confirmed) return;
    const { message, error } = await deleteProject(projectId);
    if (error) {
      toast.error(error);
    }
    toast.success(message);
  };
  return (
    <li>
      {project.title}
      <button onClick={() => handleDeleteProject(project.id)}>Delete</button>
    </li>
  );
};

export default ProjectItem;
