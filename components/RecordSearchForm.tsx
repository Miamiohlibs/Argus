'use client';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { useRef } from 'react';
import { toast } from 'react-toastify';
// import { useRouter } from 'next/navigation'; // Changed from react-router-dom
// import { bibById } from '@/app/actions/almaSearch';
import { bibHoldingsByAny } from '@/app/actions/almaSearch';
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
    if (formData.get('searchType') == 'any') {
      const input = formData.get('any-input')?.toString() ?? '';
      const result = await bibHoldingsByAny(input);
      data = result.data;
      error = result.error;
    }

    if (error) {
      toast.error(`Lookup failed -- ${error}`);
    } else {
      // toast.success('Lookup successful');
      setresults(data || null); // Set the results state with the fetched data
    }
  };

  return (
    <>
      <Form ref={formRef} action={handleSubmit}>
        <Form.Control type="hidden" name="searchType" value="any" />
        <Form.Group controlId="anySearch">
          <InputGroup className="mb-3">
            <InputGroup.Text id="any-input-label">Search by...</InputGroup.Text>
            <Form.Control
              name="any-input"
              placeholder="Enter Call Number, Barcode, MMS_ID, or Permalink URL"
              aria-label="Search String"
              aria-describedby="any-input-label"
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
      {process.env.NEXT_PUBLIC_IS_DEV_ENV && (
        <pre>{JSON.stringify(results, null, 2)}</pre>
      )}
    </>
  );
};

export default RecordSearchForm;
