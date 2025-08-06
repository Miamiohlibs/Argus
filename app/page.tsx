import Guest from '@/components/Guest';
import { currentUser } from '@clerk/nextjs/server';
import ProjectsTable from '@/components/ProjectsTable';
import CreateProjectButton from '@/components/CreateProjectButton';

const Home = async () => {
  const user = await currentUser();

  if (!user) {
    return <Guest />;
  }
  return (
    <main>
      <h2>{user.firstName}'s Projects</h2>
      <CreateProjectButton />
      <ProjectsTable limitToUser={true} />
    </main>
  );
};

export default Home;
