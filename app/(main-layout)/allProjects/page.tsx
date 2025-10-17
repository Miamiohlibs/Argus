import { Metadata } from 'next';
import ProjectsTable from '@/components/ProjectsTable';
import CreateProjectButton from '@/components/CreateProjectButton';
import getUserInfo from '@/lib/getUserInfo';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'All Projects | Argus',
    description: 'User &rsquo;s own projects',
  };
}

const AllProjectsPage = async () => {
  const {
    user,
    permissions: { isEditorOrAbove, canPrint },
  } = await getUserInfo();

  return (
    <>
      <h1 className="h2">All Projects</h1>
      {isEditorOrAbove && <CreateProjectButton />}
      <ProjectsTable limitToUser={false} user={user} canPrint={canPrint} />
    </>
  );
};

export default AllProjectsPage;
