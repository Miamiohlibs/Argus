// import { PullList } from '@/types/PullList';
import type { Project } from '@prisma/client';
import getProjects from '@/app/actions/getProjects';
// import PullListItem from './PullListItem';
import ProjectItem from './ProjectItem';
import Link from 'next/link';

const ProjectList = async () => {
  const { projects, error } = await getProjects();
  console.log('Projects:', projects);
  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!projects || projects.length === 0) {
    return (
      <>
        <p>No projects found. Add a new project to get started!</p>
        <Link href="/addProject" className="btn">
          Add Project
        </Link>
      </>
    );
  }

  return (
    <>
      <h3>Your Projects</h3>
      <Link href="/addProject" className="btn">
        Add Project
      </Link>
      <ul className="list">
        {projects &&
          projects.length > 0 &&
          projects.map((project: Project) => (
            <ProjectItem key={project.id} project={project} />
          ))}
      </ul>
    </>
  );
};

export default ProjectList;
