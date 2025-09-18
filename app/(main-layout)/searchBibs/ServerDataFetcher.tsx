import logger from '@/lib/logger';
import { checkUser } from '@/lib/checkUser';
import canEdit from '@/lib/canEdit';
// import {getProject} from '@/app/actions/projectActions';
import { unauthorized } from 'next/navigation';

interface ServerDataFetcherProps {
  projectId: string;
  children: React.ReactNode;
}

async function ServerDataFetcher({
  projectId,
  children,
}: ServerDataFetcherProps) {
  const user = await checkUser();
  const canEditBool: boolean = await canEdit(projectId?.toString() ?? 0);
  if (!user || !canEditBool) {
    return unauthorized();
  }

  return <div>{children}</div>;
}

export default ServerDataFetcher;
