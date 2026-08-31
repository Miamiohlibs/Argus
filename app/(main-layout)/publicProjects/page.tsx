import { Metadata } from 'next';
import ProjectsTable from '@/components/Projects/ProjectsTable';
import MainButtons from '@/components/MainButtons/MainButtons';
import getUserInfo from '@/lib/getUserInfo';
import checkAccess from '@/lib/checkAccess';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Public Projects | Argus',
    description: 'All public projects',
  };
}

const PublicProjectsPage = async () => {
  const {
    user,
    permissions: { isEditorOrAbove, canPrint },
  } = await getUserInfo();

  // route to login if not logged in
  await checkAccess({
    permittedRoles: ['user', 'editor', 'admin', 'superadmin'],
  });

  return (
    <>
      <h1 className="text-3xl font-medium">Public Projects</h1>
      <div className="mb-4">
        <MainButtons isEditorOrAbove={isEditorOrAbove} canPrint={canPrint} />
      </div>{' '}
      <ProjectsTable
        limitToUser={false}
        limitToPublic={true}
        user={user}
        canPrint={canPrint}
      />
    </>
  );
};

export default PublicProjectsPage;
