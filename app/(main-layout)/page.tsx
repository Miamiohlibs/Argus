import Guest from '@/components/Guest';
import { currentUser } from '@clerk/nextjs/server';
import ProjectsTable from '@/components/ProjectsTable';
import CreateProjectButton from '@/components/CreateProjectButton';
import getUserInfo from '@/lib/getUserInfo';
import { redirect } from 'next/navigation';

const Home = async () => {
  const { user, permissions } = await getUserInfo();
  const clerkUserInfo = (await currentUser()) ?? { firstName: 'Guest' };
  const isEditor = permissions.isEditorOrAbove;
  const canPrint = permissions.canPrint;

  if (!user) {
    return <Guest />;
  }
  if (!isEditor) {
    redirect('/allProjects');
  }
  return (
    <>
      <h1 className="h2">{clerkUserInfo.firstName}&apos;s Projects</h1>
      <div className="mb-3">{isEditor && <CreateProjectButton />}</div>
      <ProjectsTable limitToUser={true} user={user} canPrintBool={canPrint} />
    </>
  );
};

export default Home;
