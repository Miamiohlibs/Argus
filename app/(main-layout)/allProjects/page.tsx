import ProjectsTable from '@/components/ProjectsTable';
import CreateProjectButton from '@/components/CreateProjectButton';
// import { currentUser } from '@clerk/nextjs/server';
import { checkUser } from '@/lib/checkUser';
import { isEditorOrAbove, canPrint } from '@/lib/canEdit';
import getUserInfo from '@/lib/getUserInfo';

const AllProjectsPage = async () => {
  // const clerkUser = (await currentUser()) || null;
  // const userId = clerkUser ? clerkUser.id || null : null;
  const { user, permissions } = await getUserInfo();
  // const user = await checkUser();
  const isEditor = permissions.isEditorOrAbove;
  const canPrint = permissions.canPrint;

  return (
    <>
      <h1 className="h2">All Projects</h1>
      {isEditor && <CreateProjectButton />}
      <ProjectsTable limitToUser={false} user={user} canPrintBool={canPrint} />
    </>
  );
};

export default AllProjectsPage;
