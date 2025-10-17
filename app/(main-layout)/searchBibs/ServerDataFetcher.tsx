import logger from '@/lib/logger';
import getUserInfo from '@/lib/getUserInfo';
import { unauthorized } from 'next/navigation';

interface ServerDataFetcherProps {
  projectId: string;
  children: React.ReactNode;
}

async function ServerDataFetcher({
  projectId,
  children,
}: ServerDataFetcherProps) {
  const {
    user,
    permissions: { canEdit },
  } = await getUserInfo(projectId);
  if (!user || !canEdit) {
    return unauthorized();
  }

  return <div>{children}</div>;
}

export default ServerDataFetcher;
