import { CondensedBibHoldings } from '@/types/CondensedBibHoldings';
import { EntryWithItems } from '@/types/EntryWithItems';
import BibEntryComponent from './BibEntryComponent';
import HoldingEntry from './HoldingEntry';

interface BibResultsWrapperProps {
  projectId: number | undefined;
  holdingsData: CondensedBibHoldings | undefined;
  actionType: 'add' | 'edit';
  existingEntry?: EntryWithItems;
  isEditor: boolean;
}

export default function BibResultsWrapper({
  holdingsData,
  projectId,
  actionType,
  existingEntry,
  isEditor,
}: BibResultsWrapperProps) {
  return holdingsData ? (
    <div aria-live="polite">
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
      />
    </div>
  ) : (
    <p>No Results Found</p>
  );
}
