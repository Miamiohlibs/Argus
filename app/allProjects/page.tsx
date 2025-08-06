import ProjectsTable from '@/components/ProjectsTable';
import CreateProjectButton from '@/components/CreateProjectButton';
import { currentUser } from '@clerk/nextjs/server';

const AllProjectsPage = async () => {
  const clerkUser = (await currentUser()) || null;
  const userId = clerkUser ? clerkUser.id || null : null;

  return (
    <main>
      <h2>All Projects</h2>
      <CreateProjectButton />
      <ProjectsTable limitToUser={false} user={userId} />
    </main>
  );
};

export default AllProjectsPage;
