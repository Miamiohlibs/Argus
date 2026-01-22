import { CondensedBibHoldings } from '@/types/CondensedBibHoldings';
import { EntryWithItems } from '@/types/EntryWithItems';
import BibEntryComponent from './BibEntryComponent';
import HoldingEntry from './HoldingEntry';
import { Spinner } from 'react-bootstrap';

interface BibResultsWrapperProps {
  projectId: number | undefined;
  holdingsData: CondensedBibHoldings | undefined;
  actionType: 'add' | 'edit' | 'quickSlip';
  existingEntry?: EntryWithItems;
  isEditor: boolean;
  searchActive?: boolean;
  searchFailed?: boolean;
  quickSlip?: boolean;
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
        <BibEntryComponent entry={holdingsData.bib_data} />

        <HoldingEntry
          items={holdingsData.items}
          bibData={holdingsData.bib_data}
          projectId={projectId !== undefined ? projectId : 0}
          locationCodes={holdingsData.locationCodes}
          locationNames={holdingsData.locationNames ?? ''}
          actionType={actionType}
          existingEntry={existingEntry}
          isEditor={isEditor}
          quickSlip={quickSlip ?? false}
        />
      </>
    );
  }
}
