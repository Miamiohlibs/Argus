'use client';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { useRef } from 'react';
import { toast } from 'react-toastify';
import { searchCatalogByAny } from '@/app/actions/catalogSearch';
import { useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Catalog } from '@prisma/client';
import type { CatalogSearchResult } from '@/lib/catalogs/types';
import BibResultsWrapper from './BibResultsWrapper';

type RecordSearchFormProps =
  | {
      quickSlip: false;
      projectId: number;
      userCanEditPage: boolean;
      nonOwnerEditor: boolean;
      currentUserName: string;
      searchPlaceholder: string;
      catalog?: Catalog;
    }
  | { quickSlip: true };

const RecordSearchForm = (props: RecordSearchFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const searchParams = useSearchParams();
  let projectId,
    userCanEditPage,
    quickSlip,
    nonOwnerEditor,
    currentUserName,
    placeholder,
    catalog;
  if (props.quickSlip) {
    quickSlip = true;
    userCanEditPage = true;
    projectId = undefined;
    catalog = 'ALMA' as Catalog;
  } else {
    quickSlip = false;
    userCanEditPage = props.userCanEditPage;
    projectId = props.projectId;
    nonOwnerEditor = props.nonOwnerEditor;
    currentUserName = props.currentUserName;
    placeholder = props.searchPlaceholder;
    catalog =
      props.catalog ??
      ((searchParams?.get('catalog') as Catalog | null) || 'ALMA');
  }
  const [results, setResults] = useState<CatalogSearchResult | null>(null);
  const [searchFailed, setSearchFailed] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (formData: FormData) => {
    setResults(null); // Clear previous results
    let data: CatalogSearchResult | undefined | null,
      error: string | undefined | null;

    startTransition(async () => {
      // Determine which search type was used and call the appropriate function
      if (formData.get('searchType') == 'any') {
        const input = formData.get('any-input')?.toString() ?? '';
        const result = await searchCatalogByAny(catalog, input);
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
              placeholder={placeholder}
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
          actionType={quickSlip ? 'quickSlip' : 'add'}
          isEditor={userCanEditPage}
          searchActive={isPending}
          searchFailed={searchFailed}
          quickSlip={quickSlip}
          currentUserName={currentUserName ?? 'unknown'}
          nonOwnerEditor={nonOwnerEditor ?? false}
        />
        {process.env.NEXT_PUBLIC_IS_DEV_ENV && results && (
          <pre>{JSON.stringify(results, null, 2)}</pre>
        )}
      </div>
    </>
  );
};

export default RecordSearchForm;
