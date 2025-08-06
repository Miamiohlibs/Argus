import ProjectsTable from '@/components/ProjectsTable';

const AllProjectsPage = () => {
  return (
    <main>
      <h2>All Projects</h2>
      <ProjectsTable limitToUser={false} />
    </main>
  );
};

export default AllProjectsPage;
