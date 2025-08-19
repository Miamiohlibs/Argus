'use client';
import RecordSearchForm from '@/components/RecordSearchForm';
import { useSearchParams } from 'next/navigation';
import { Button } from 'react-bootstrap';
import Link from 'next/link';

interface ClientSearchBibsPageProps {
  projectId?: number;
}

const ClientSearchBibsPage = ({ projectId }: ClientSearchBibsPageProps) => {
  // You can still use useSearchParams if needed for other params
  const params = useSearchParams();
  const tempId = projectId || params?.get('projectId') || 'none';
  let numericId: number;
  if (typeof tempId === 'number') {
    numericId = tempId;
  } else {
    numericId = parseInt(tempId, 10);
  }
  if (tempId == 'none' || isNaN(numericId)) {
    return <>`Invalid project ID: ${tempId}`</>;
  }
  const clientProjectId = numericId;

  // You can also access other query parameters here
  // const otherParam = params?.get('someOtherParam');

  return (
    <>
      <h1>Search Bibs</h1>
      <Link href={`/project/${clientProjectId}`}>
        <Button variant="outline-secondary" className="mb-3">
          Back to Project
        </Button>
      </Link>
      <RecordSearchForm projectId={clientProjectId} />
    </>
  );
};

export default ClientSearchBibsPage;
//   try {
//     const results = await findByBarcode(barcode);
//     console.log('Search results by barcode:', results.bib_data);
//     return <pre>{JSON.stringify(results.bib_data, null, 2)}</pre>;
//   } catch (error) {
//     console.error('Error searching by barcode:', error);
//   }
