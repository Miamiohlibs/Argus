import { Metadata } from 'next';
import Guest from '@/components/Guest';
import { currentUser } from '@clerk/nextjs/server';
import ProjectsTable from '@/components/ProjectsTable';
import MainButtons from '@/components/MainButtons';
import getUserInfo from '@/lib/getUserInfo';
import { redirect } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Main Page | Argus',
    description: 'User &rsquo;s own projects',
  };
}

const Home = async () => {
  const {
    user,
    permissions: { isEditorOrAbove, canPrint },
  } = await getUserInfo();
  const clerkUserInfo = (await currentUser()) ?? { firstName: 'Guest' };
  let displayName = clerkUserInfo.firstName;
  if (
    clerkUserInfo == null ||
    clerkUserInfo.firstName == 'null' ||
    clerkUserInfo.firstName == '[null]' ||
    clerkUserInfo.firstName == ''
  ) {
    if (user && user.name && user.name != 'null' && user.name != '[null]') {
      displayName = user.name;
    } else if (user && user.email) {
      displayName = user.email;
    }
  }
  if (!user) {
    return <Guest />;
  }
  if (!isEditorOrAbove) {
    redirect('/allProjects');
  }
  return (
    <>
      <h1 className="h2">{displayName}&apos;s Projects</h1>
      <div className="mb-3">
        <MainButtons isEditorOrAbove={isEditorOrAbove} canPrint={canPrint} />
      </div>
      <ProjectsTable limitToUser={true} user={user} canPrint={canPrint} />
    </>
  );
};

export default Home;
