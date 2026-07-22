import { Metadata } from 'next';
import ProjectsTable from '@/components/ProjectsTable';
import MainButtons from '@/components/MainButtons';
import getUserInfo from '@/lib/getUserInfo';
import { redirect, RedirectType } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'All Projects | Argus',
    description: 'User &rsquo;s own projects',
  };
}

const AllProjectsPage = async () => {
  const {
    user,
    permissions: { isEditorOrAbove, isAdmin, canPrint },
  } = await getUserInfo();

  if (!isAdmin) {
    // route to publicProjects
    redirect('/publicProjects', RedirectType.replace);
  }
  return (
    <>
      <h1 className="text-3xl font-medium">All Projects</h1>
      <div className="mb-4">
        <MainButtons isEditorOrAbove={isEditorOrAbove} canPrint={canPrint} />
      </div>
      <ProjectsTable limitToUser={false} user={user} canPrint={canPrint} />
    </>
  );
};

export default AllProjectsPage;
