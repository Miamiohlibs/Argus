'use client';
import { findByBarcode, bibById } from '../actions/almaSearch';
import RecordSearchForm from '@/components/RecordSearchForm';
import { useSearchParams } from 'next/navigation';

const SearchBibsPage = () => {
  // get recordId from URL params
  const params = useSearchParams();
  // console.log('All params:', Object.fromEntries(params.entries())); // Debug all params
  // console.log('projectId param:', params.get('projectId'));

  const projectId = params?.get('projectId') ?? 'none';

  return (
    <>
      <h1>Search Bibs</h1>
      <RecordSearchForm projectId={projectId} />
      {/* Uncomment the following lines to test barcode search */}
      {/* <pre>{JSON.stringify(await findByBarcode(barcode), null, 2)}</pre> */}
    </>
  );
  //   try {
  //     const results = await findByBarcode(barcode);
  //     console.log('Search results by barcode:', results.bib_data);
  //     return <pre>{JSON.stringify(results.bib_data, null, 2)}</pre>;
  //   } catch (error) {
  //     console.error('Error searching by barcode:', error);
  //   }
};

export default SearchBibsPage;
