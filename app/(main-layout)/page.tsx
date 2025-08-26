import Guest from '@/components/Guest';
import { currentUser } from '@clerk/nextjs/server';
import ProjectsTable from '@/components/ProjectsTable';
import CreateProjectButton from '@/components/CreateProjectButton';
import { checkUser } from '@/lib/checkUser';
import { isEditorOrAbove } from '@/lib/canEdit';
import { redirect } from 'next/navigation';
const Home = async () => {
  const user = await checkUser();
  const clerkUserInfo = (await currentUser()) ?? { firstName: 'Guest' };
  const isEditor = await isEditorOrAbove();

  if (!user) {
    return <Guest />;
  }
  if (!isEditor) {
    redirect('/allProjects');
  }
  return (
    <main>
      <h2>{clerkUserInfo.firstName}&apos;s Projects</h2>
      <div className="mb-3">{isEditor && <CreateProjectButton />}</div>
      <ProjectsTable limitToUser={true} user={user} />
    </main>
  );
};

export default Home;
