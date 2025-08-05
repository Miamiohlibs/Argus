// import { PullList } from '@/types/PullList';
import type { Project } from '@prisma/client';
import getProjects from '@/app/actions/getProjects';
// import PullListItem from './PullListItem';

const ProjectList = async () => {
  const { projects, error } = await getProjects();
  console.log('Projects:', projects);
  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!projects || projects.length === 0) {
    return <p>No pull lists found. Add a new list to get started!</p>;
  }

  return (
    <>
      <h3>Your Projects</h3>
      <ul className="list">
        {projects &&
          projects.length > 0 &&
          projects.map((project: Project) => (
            <li key={project.id}>
              {project.title} (ID: {project.id})
            </li>
          ))}
      </ul>
    </>
  );
};

export default ProjectList;
