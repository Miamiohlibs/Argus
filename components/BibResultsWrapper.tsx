import { CondensedBibHoldings } from '@/types/CondensedBibHoldings';
import { EntryWithItems } from '@/types/EntryWithItems';
import BibEntryComponent from './BibEntryComponent';
import HoldingEntry from './HoldingEntry';

interface BibResultsWrapperProps {
  projectId: number | undefined;
  holdingsData: CondensedBibHoldings[] | undefined;
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
    <>
      {holdingsData.map((holding) => (
        <div key={holding.holding_data.holding_id}>
          <BibEntryComponent entry={holding.bib_data} />
          <HoldingEntry
            holdings={holding.holding_data}
            items={holding.items}
            bibData={holding.bib_data}
            projectId={projectId !== undefined ? projectId : 0}
            locationCodes={holding.locationCodes}
            actionType={actionType}
            existingEntry={existingEntry}
            isEditor={isEditor}
          />
        </div>
      ))}
    </>
  ) : (
    <p>No Results Found</p>
  );
}
