import ProjectsTable from '@/components/ProjectsTable';
import CreateProjectButton from '@/components/CreateProjectButton';
// import { currentUser } from '@clerk/nextjs/server';
import { checkUser } from '@/lib/checkUser';
import { isEditorOrAbove } from '@/lib/canEdit';

const AllProjectsPage = async () => {
  // const clerkUser = (await currentUser()) || null;
  // const userId = clerkUser ? clerkUser.id || null : null;
  const user = await checkUser();
  const isEditor = await isEditorOrAbove();

  return (
    <main>
      <h2>All Projects</h2>
      {isEditor && <CreateProjectButton />}
      <ProjectsTable limitToUser={false} user={user} />
    </main>
  );
};

export default AllProjectsPage;
