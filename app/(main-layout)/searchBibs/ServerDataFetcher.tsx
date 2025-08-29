import logger from '@/lib/logger';
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

  return <div>{children}</div>;
}

export default ServerDataFetcher;
