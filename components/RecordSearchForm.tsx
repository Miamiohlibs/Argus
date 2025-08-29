'use client';
import logger from '@/lib/logger';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { useRef } from 'react';
import { toast } from 'react-toastify';
// import { useRouter } from 'next/navigation'; // Changed from react-router-dom
// import { bibById } from '@/app/actions/almaSearch';
import { bibHoldings, bibHoldingsByBarcode } from '@/app/actions/almaSearch';
import { useState } from 'react';
import type { CondensedBibHoldings } from '@/types/CondensedBibHoldings';
import BibResultsWrapper from './BibResultsWrapper';

interface RecordSearchFormProps {
  projectId: number;
  userCanEditPage: boolean;
}

const RecordSearchForm = ({
  projectId,
  userCanEditPage,
}: RecordSearchFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  // const router = useRouter(); // Changed from useNavigate
  // const [results, setresults] = useState<MmsidSearchResultOrNull>(null); // State to hold search results
  const [results, setresults] = useState<CondensedBibHoldings | null>(null);

  const handleSubmit = async (formData: FormData) => {
    let data, error;
    if (formData.get('searchType') == 'mms-id') {
      const mms_id = formData.get('mms-id');
      // const { data: bibData, error: bibError } = await bibById({ mms_id: mms_id?.toString() || '' });
      const result = await bibHoldings({
        mms_id: mms_id?.toString() || '',
      });
      data = result.data;
      error = result.error;
    } else if (formData.get('searchType') == 'barcode') {
      const barcode = formData.get('barcode');
      const result = await bibHoldingsByBarcode({
        barcode: barcode?.toString() || '',
      });
      data = result.data;
      error = result.error;
    }

    // logger.verbose('Data from bibById:', data);
    if (error) {
      toast.error('Lookup failed');
      //   router.push('/'); // Redirect to home on error
    } else {
      // toast.success('Lookup successful');
      setresults(data || null); // Set the results state with the fetched data
      // Optionally, you can redirect or perform other actions with the results
      // router.push('/'); // Uncomment if you want to redirect after successful search
    }
  };
  // const handleBarcodeSearch = async (formData: FormData) => {
  //   const barcode = formData.get('barcode');
  //   const { data, error } = await bibById({
  //     mms_id: barcode?.toString() || '',
  //   });
  //   // logger.verbose('Data from bibById:', data);
  //   if (error) {
  //     toast.error('Lookup failed');
  //     //   router.push('/'); // Redirect to home on error
  //   } else {
  //     // toast.success('Lookup successful');
  //     setresults(data); // Set the results state with the fetched data
  //     // Optionally, you can redirect or perform other actions with the results
  //     // router.push('/'); // Uncomment if you want to redirect after successful search
  //   }
  // };

  return (
    <>
      <Form ref={formRef} action={handleSubmit}>
        <Form.Control type="hidden" name="searchType" value="mms-id" />
        <Form.Group controlId="mmsIdSearch">
          <InputGroup className="mb-3">
            <InputGroup.Text id="mms-id">MMS ID</InputGroup.Text>
            <Form.Control
              name="mms-id"
              placeholder="Enter MMS ID"
              aria-label="MMS ID"
              aria-describedby="mms-id"
            />
            <Button type="submit" variant="primary">
              Search
            </Button>
          </InputGroup>
        </Form.Group>
      </Form>
      <Form ref={formRef} action={handleSubmit}>
        <Form.Control type="hidden" name="searchType" value="barcode" />
        <Form.Group controlId="barcodeSearch">
          <InputGroup className="mb-3">
            <InputGroup.Text id="barcode">Barcode</InputGroup.Text>
            <Form.Control
              name="barcode"
              placeholder="Enter Barcode"
              aria-label="Barcode"
              aria-describedby="barcode"
            />
            <Button type="submit" variant="primary">
              Search
            </Button>
          </InputGroup>
        </Form.Group>
      </Form>

      <BibResultsWrapper
        projectId={projectId}
        holdingsData={results ?? undefined}
        actionType={'add'}
        isEditor={userCanEditPage}
      />

      {/* {results ? (
        results.map((holding) => {
          return (
            <div key={holding.holding_data.holding_id}>
              <BibEntryComponent entry={holding.bib_data} />
              <HoldingEntry
                holdings={holding.holding_data}
                items={holding.items}
                bibData={holding.bib_data}
                projectId={projectId}
                locationCodes={holding.locationCodes}
              />
            </div>
          );
        })
      ) : (
        <p>No Results Found</p>
      )} */}
      <pre>{JSON.stringify(results, null, 2)}</pre>
    </>
  );
};

export default RecordSearchForm;
