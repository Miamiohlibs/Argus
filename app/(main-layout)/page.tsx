import Guest from '@/components/Guest';
import { currentUser } from '@clerk/nextjs/server';
import ProjectsTable from '@/components/ProjectsTable';
import CreateProjectButton from '@/components/CreateProjectButton';
import getUserInfo from '@/lib/getUserInfo';
import { redirect } from 'next/navigation';

const Home = async () => {
  const {
    user,
    permissions: { isEditorOrAbove, canPrint },
  } = await getUserInfo();
  const clerkUserInfo = (await currentUser()) ?? { firstName: 'Guest' };

  if (!user) {
    return <Guest />;
  }
  if (!isEditorOrAbove) {
    redirect('/allProjects');
  }
  return (
    <>
      <h1 className="h2">{clerkUserInfo.firstName}&apos;s Projects</h1>
      <div className="mb-3">{isEditorOrAbove && <CreateProjectButton />}</div>
      <ProjectsTable limitToUser={true} user={user} canPrintBool={canPrint} />
    </>
  );
};

export default Home;
