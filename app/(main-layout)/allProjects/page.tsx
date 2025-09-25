import ProjectsTable from '@/components/ProjectsTable';
import CreateProjectButton from '@/components/CreateProjectButton';
import getUserInfo from '@/lib/getUserInfo';

const AllProjectsPage = async () => {
  const {
    user,
    permissions: { isEditorOrAbove, canPrint },
  } = await getUserInfo();

  return (
    <>
      <h1 className="h2">All Projects</h1>
      {isEditorOrAbove && <CreateProjectButton />}
      <ProjectsTable limitToUser={false} user={user} canPrintBool={canPrint} />
    </>
  );
};

export default AllProjectsPage;
