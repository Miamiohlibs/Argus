import Guest from '@/components/Guest';
import { currentUser } from '@clerk/nextjs/server';
import ProjectsTable from '@/components/ProjectsTable';
import CreateProjectButton from '@/components/CreateProjectButton';
import { checkUser } from '@/lib/checkUser';
import { isEditorOrAbove, canPrint } from '@/lib/canEdit';
import { redirect } from 'next/navigation';

const Home = async () => {
  const user = await checkUser();
  const clerkUserInfo = (await currentUser()) ?? { firstName: 'Guest' };
  const isEditor = await isEditorOrAbove();
  const canPrintBool = (await canPrint()) ?? false;

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
      <ProjectsTable
        limitToUser={true}
        user={user}
        canPrintBool={canPrintBool}
      />
    </>
  );
};

export default Home;
