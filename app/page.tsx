import Guest from '@/components/Guest';
import { currentUser } from '@clerk/nextjs/server';
import ProjectList from '@/components/ProjectList';
import ProjectsTable from '@/components/ProjectsTable';
const Home = async () => {
  const user = await currentUser();

  if (!user) {
    return <Guest />;
  }
  return (
    <main>
      <h2>Welcome, {user.firstName} </h2>
      <ProjectsTable limitToUser={true} />
    </main>
  );
};

export default Home;
