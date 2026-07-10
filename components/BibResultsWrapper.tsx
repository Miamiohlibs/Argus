import { CatalogSearchResult } from '@/lib/catalogs/types';
import { EntryWithItems } from '@/types/EntryWithItems';
import BibEntryComponent from './BibEntryComponent';
import HoldingEntry from './HoldingEntry';
import { Spinner } from 'react-bootstrap';

interface BibResultsWrapperProps {
  projectId: number | undefined;
  holdingsData: CatalogSearchResult | undefined;
  actionType: 'add' | 'edit' | 'quickSlip';
  existingEntry?: EntryWithItems;
  isEditor: boolean;
  searchActive?: boolean;
  searchFailed?: boolean;
  quickSlip?: boolean;
  currentUserName: string;
  nonOwnerEditor: boolean;
}

export default function BibResultsWrapper({
  holdingsData,
  projectId,
  actionType,
  existingEntry,
  isEditor,
  searchActive,
  searchFailed,
  quickSlip,
  currentUserName,
  nonOwnerEditor,
}: BibResultsWrapperProps) {
  if (searchActive) {
    return (
      <div className="d-flex justify-content-center w-100 bg-info bg-opacity-25 p-3">
        <Spinner animation="border" className="me-2" />
        <p className="fs-4">Searching...</p>
      </div>
    );
  } else if (holdingsData === undefined || holdingsData === null) {
    if (searchFailed) {
      return <p>No Results Found</p>;
    } else {
      return <p>Enter search criteria and click Search to find items.</p>;
    }
  } else {
    return (
      <>
        <BibEntryComponent entry={holdingsData.bibData} extra={holdingsData.extra} />

        <HoldingEntry
          items={holdingsData.itemData}
          bibData={holdingsData.bibData}
          projectId={projectId !== undefined ? projectId : 0}
          actionType={actionType}
          existingEntry={existingEntry}
          isEditor={isEditor}
          quickSlip={quickSlip ?? false}
          nonOwnerEditor={nonOwnerEditor}
          currentUserName={currentUserName}
        />
      </>
    );
  }
}
