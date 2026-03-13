import { Metadata } from 'next';
import ClientSearchBibsPage from './ClientSearchBibsPage';
import ServerDataFetcher from './ServerDataFetcher';
import getUserInfo from '@/lib/getUserInfo';
import { getProject } from '@/app/actions/projectActions';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Search Catalog for Item | Argus',
    description: 'Look up item from library catalog',
  };
}

interface SearchBibsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Server component - receives searchParams automatically
async function SearchBibsPage({ searchParams }: SearchBibsPageProps) {
  const resolvedParams = await searchParams;
  const tempId = (resolvedParams.projectId as string) || 'none';

  let numericId: number;
  if (typeof tempId === 'number') {
    numericId = tempId;
  } else {
    numericId = parseInt(tempId, 10);
  }
  if (tempId == 'none' || isNaN(numericId)) {
    return <>`Invalid project ID: ${tempId}`</>;
  }
  const projectId = numericId;
  const {
    permissions: { canEdit, canPrint, nonOwnerEditor },
  } = await getUserInfo(projectId);
  const { project } = await getProject({ id: projectId.toString() });

  if (project) {
    return (
      <ServerDataFetcher projectId={projectId.toString()}>
        <ClientSearchBibsPage
          projectId={projectId}
          userCanEditPage={canEdit ?? false}
          userCanPrint={canPrint ?? false}
          nonOwnerAlert={nonOwnerEditor ?? false}
          project={project}
        />
      </ServerDataFetcher>
    );
  }
}

export default SearchBibsPage;
