import Guest from '@/components/Guest';
import { currentUser } from '@clerk/nextjs/server';
import PullListList from '@/components/PullListList';

const Home = async () => {
  const user = await currentUser();

  if (!user) {
    return <Guest />;
  }
  return (
    <main>
      <h2>Welcome, {user.firstName} </h2>
      <PullListList userId={user.id} />
    </main>
  );
};

export default Home;
