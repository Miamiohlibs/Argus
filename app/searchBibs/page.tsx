import ClientSearchBibsPage from './ClientSearchBibsPage';
import ServerDataFetcher from './ServerDataFetcher';

interface SearchBibsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Server component - receives searchParams automatically
async function SearchBibsPage({ searchParams }: SearchBibsPageProps) {
  const resolvedParams = await searchParams;
  const projectId = (resolvedParams.projectId as string) || 'none';

  return (
    <ServerDataFetcher projectId={projectId}>
      <ClientSearchBibsPage projectId={projectId} />
    </ServerDataFetcher>
  );
}

export default SearchBibsPage;
