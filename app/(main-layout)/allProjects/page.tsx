import ProjectsTable from '@/components/ProjectsTable';
import CreateProjectButton from '@/components/CreateProjectButton';
import getUserInfo from '@/lib/getUserInfo';

const AllProjectsPage = async () => {
  const { user, permissions } = await getUserInfo();
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
