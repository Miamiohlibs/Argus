'use client';
import { findByBarcode, bibById } from '../actions/almaSearch';
const barcode = '35054035116561';
import RecordSearchForm from '@/components/RecordSearchForm';
const SearchBibsPage = () => {
  return (
    <>
      <h1>Search Bibs</h1>
      <RecordSearchForm />
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
