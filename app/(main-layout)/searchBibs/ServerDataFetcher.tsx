import { checkUser } from '@/lib/checkUser';
import { currentUser } from '@clerk/nextjs/server';
import getProject from '@/app/actions/getProject';

interface ServerDataFetcherProps {
  projectId: string;
  children: React.ReactNode;
}

async function ServerDataFetcher({
  projectId,
  children,
}: ServerDataFetcherProps) {
  const clerkUser = await currentUser();
  const user = await checkUser();
  const project = await getProject({ id: projectId });

  if (!user || !clerkUser || user.clerkUserId !== project?.project?.userId) {
    return <div>Unauthorized</div>;
  }

  //   // Now you can use the projectId in server-side operations
  //   let projectData = null;
  //   if (projectId && projectId !== 'none') {
  //     try {
  //       // You can add your getProject action here when you create it
  //       // const { data: project } = await getProject(projectId);
  //       // projectData = project;
  //       console.log('Server-side projectId:', projectId, JSON.stringify(project));
  //     } catch (error) {
  //       console.error('Error fetching project:', error);
  //     }
  //   }

  return <div>{children}</div>;
}

export default ServerDataFetcher;
