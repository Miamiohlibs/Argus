import { Metadata } from 'next';
import ProjectsTable from '@/components/ProjectsTable';
import CreateProjectButton from '@/components/CreateProjectButton';
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
      <h1 className="h2">Public Projects</h1>
      {isEditorOrAbove && <CreateProjectButton />}
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
