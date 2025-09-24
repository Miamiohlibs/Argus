import ProjectsTable from '@/components/ProjectsTable';
import CreateProjectButton from '@/components/CreateProjectButton';
// import { currentUser } from '@clerk/nextjs/server';
import { checkUser } from '@/lib/checkUser';
import { isEditorOrAbove, canPrint } from '@/lib/canEdit';

const AllProjectsPage = async () => {
  // const clerkUser = (await currentUser()) || null;
  // const userId = clerkUser ? clerkUser.id || null : null;
  const user = await checkUser();
  const isEditor = await isEditorOrAbove();
  const canPrintBool = (await canPrint()) ?? false;

  return (
    <>
      <h1 className="h2">All Projects</h1>
      {isEditor && <CreateProjectButton />}
      <ProjectsTable
        limitToUser={false}
        user={user}
        canPrintBool={canPrintBool}
      />
    </>
  );
};

export default AllProjectsPage;
