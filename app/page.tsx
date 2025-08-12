import Guest from '@/components/Guest';
import { currentUser } from '@clerk/nextjs/server';
import ProjectsTable from '@/components/ProjectsTable';
import CreateProjectButton from '@/components/CreateProjectButton';
import { checkUser } from '@/lib/checkUser';

const Home = async () => {
  const user = await checkUser();
  const clerkUserInfo = (await currentUser()) ?? { firstName: 'Guest' };

  if (!user) {
    return <Guest />;
  }
  return (
    <main>
      <h2>{clerkUserInfo.firstName}'s Projects</h2>
      <CreateProjectButton />
      <ProjectsTable limitToUser={true} user={user} />
    </main>
  );
};

export default Home;
