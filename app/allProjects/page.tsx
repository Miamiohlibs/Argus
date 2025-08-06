import ProjectsTable from '@/components/ProjectsTable';
import CreateProjectButton from '@/components/CreateProjectButton';

const AllProjectsPage = () => {
  return (
    <main>
      <h2>All Projects</h2>
      <CreateProjectButton />
      <ProjectsTable limitToUser={false} />
    </main>
  );
};

export default AllProjectsPage;
