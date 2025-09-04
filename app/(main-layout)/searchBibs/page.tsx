import ClientSearchBibsPage from './ClientSearchBibsPage';
import ServerDataFetcher from './ServerDataFetcher';
import canEdit from '@/lib/canEdit';

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
  const userCanEditPage = await canEdit(projectId);
  console.log('can edit:', userCanEditPage);
  return (
    <ServerDataFetcher projectId={projectId.toString()}>
      <ClientSearchBibsPage
        projectId={projectId}
        userCanEditPage={userCanEditPage}
      />
    </ServerDataFetcher>
  );
}

export default SearchBibsPage;
