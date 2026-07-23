import { CatalogSearchResult } from '@/lib/catalogs/types';
import { EntryWithItems } from '@/types/EntryWithItems';
import BibEntryComponent from './BibEntryComponent';
import HoldingEntry from './HoldingEntry';
import Spinner from '@/components/ui/Spinner';
import { currentUser } from '@clerk/nextjs/server';
import { User } from '@prisma/client';

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
  currentUser?: User;
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
  currentUser,
}: BibResultsWrapperProps) {
  if (searchActive) {
    return (
      <div className="flex justify-center w-full bg-info/25 p-4">
        <Spinner className="me-2" />
        <p className="text-2xl">Searching...</p>
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
        <BibEntryComponent
          entry={holdingsData.bibData}
          extra={holdingsData.extra}
        />

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
          currentUser={currentUser}
        />
      </>
    );
  }
}
