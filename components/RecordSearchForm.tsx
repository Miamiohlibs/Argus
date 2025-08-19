'use client';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { useRef } from 'react';
import { toast } from 'react-toastify';
// import { useRouter } from 'next/navigation'; // Changed from react-router-dom
// import { bibById } from '@/app/actions/almaSearch';
import { bibHoldings } from '@/app/actions/almaSearch';
import { useState } from 'react';
import BibEntryComponent from './BibEntryComponent';
import HoldingEntry from './HoldingEntry';
import type { AlmaMmsidSearchResult } from '@/types/AlmaMmsidSearchResult';
import type { CondensedBibHoldings } from '@/types/CondensedBibHoldings';
import { Card, CardBody } from 'react-bootstrap';
import BibResultsWrapper from './BibResultsWrapper';

interface RecordSearchFormProps {
  projectId: number;
}

const RecordSearchForm = ({ projectId }: RecordSearchFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  // const router = useRouter(); // Changed from useNavigate
  // const [results, setresults] = useState<MmsidSearchResultOrNull>(null); // State to hold search results
  const [results, setresults] = useState<CondensedBibHoldings[] | null>(null);

  const handleSubmit = async (formData: FormData) => {
    const mms_id = formData.get('mms-id');
    // const { data, error } = await bibById({ mms_id: mms_id?.toString() || '' });
    const { data, error } = await bibHoldings({
      mms_id: mms_id?.toString() || '',
    });
    // console.log('Data from bibById:', data);
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
  //   // console.log('Data from bibById:', data);
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
      {/* <Form ref={formRef} action={handleBarcodeSearch}>
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
      </Form> */}
      {/* Expecting array of : 
  {
  bib_data: AlmaItemHoldingBibData;
  holding_data: AlmaItemHoldingHoldingData;
  items: AlmaItemHoldingItemData[];
  locationCodes: string;
  }
  */}
      {/* {results?.map((holding) => (
        <div key={holding.bib_data.mms_id}>
          {holding && holding.bib_data ? (
            <>
              <BibEntryComponent entry={holding.bib_data} />
            </>
          ) : (
            <p>No results found.</p>
          )}
          {holding ? (
            <>
              <HoldingEntry holdings={results.holding} projectId={projectId} />
            </>
          ) : null}
        </div>
      ))} */}

      <BibResultsWrapper
        projectId={projectId}
        holdingsData={results ?? undefined}
        actionType={'add'}
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
