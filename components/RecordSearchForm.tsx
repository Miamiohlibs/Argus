'use client';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { useRef } from 'react';
import { toast } from 'react-toastify';
import { bibHoldingsByAny } from '@/app/actions/almaSearch';
import { useState, useTransition } from 'react';
import type { CondensedBibHoldings } from '@/types/CondensedBibHoldings';
import BibResultsWrapper from './BibResultsWrapper';

type RecordSearchFormProps =
  | { quickslip: false; projectId: number; userCanEditPage: boolean }
  | { quickslip: true; projectId: never; userCanEditPage: never };

const RecordSearchForm = ({
  projectId,
  userCanEditPage,
}: RecordSearchFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [results, setResults] = useState<CondensedBibHoldings | null>(null);
  const [searchFailed, setSearchFailed] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (formData: FormData) => {
    setResults(null); // Clear previous results
    let data: CondensedBibHoldings | undefined | null,
      error: string | undefined | null;

    startTransition(async () => {
      // Determine which search type was used and call the appropriate function
      if (formData.get('searchType') == 'any') {
        const input = formData.get('any-input')?.toString() ?? '';
        const result = await bibHoldingsByAny(input);
        data = result.data;
        error = result.error;
      }

      if (error) {
        toast.error(`Lookup failed -- ${error}`);
        setSearchFailed(true);
        setResults(null); // Clear results on error
      } else {
        // toast.success('Lookup successful');
        setResults(data || null); // Set the results state with the fetched data
      }
    });
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

      <div aria-live="assertive">
        <BibResultsWrapper
          projectId={projectId}
          holdingsData={results ?? undefined}
          actionType={'add'}
          isEditor={userCanEditPage}
          searchActive={isPending}
          searchFailed={searchFailed}
        />

        {process.env.NEXT_PUBLIC_IS_DEV_ENV && results && (
          <pre>{JSON.stringify(results, null, 2)}</pre>
        )}
      </div>
    </>
  );
};

export default RecordSearchForm;
