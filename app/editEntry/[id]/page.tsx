import { EntryWithItems } from '@/types/EntryWithItems';
import { AlmaItemHoldingBibData } from '@/types/AlmaItem';
import { bibHoldings } from '@/app/actions/almaSearch';
import BibEntryComponent from '@/components/BibEntryComponent';
import HoldingEntry from '@/components/HoldingEntry';
import getEntryById from '@/app/actions/getEntryById';
import { CondensedBibHoldings } from '@/types/CondensedBibHoldings';
import BibResultsWrapper from '@/components/BibResultsWrapper';

export default async function EditEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const {
    data: existingEntry,
    error: existingEntryError,
  }: { data?: EntryWithItems; error?: string } = await getEntryById(id);
  if (existingEntryError) {
    return <>Unable to retrieve existing entry</>;
  }
  const projectId = existingEntry?.projectId;
  const mmsId = existingEntry?.almaId ?? '';
  const {
    data: holdingsData,
    error: holdingsError,
  }: { data?: CondensedBibHoldings[]; error?: string } = await bibHoldings({
    mms_id: mmsId,
  });
  if (holdingsError) {
    return <>Error refreshing catalog data</>;
  }
  return (
    <>
      <h1>Edit Entry</h1>
      <p>{id}</p>
      {/* Note : this section duplicates part of RecordSearchForm -- we should dedup the code */}
      <BibResultsWrapper
        projectId={projectId}
        holdingsData={holdingsData}
        actionType="edit"
        existingEntry={existingEntry}
      />
      {JSON.stringify(existingEntry, null, 2)}
      <br />
      <br />
      {JSON.stringify(holdingsData, null, 2)}
    </>
  );

  //   return (
  //     <>

  //       <BibEntryComponent entry={} />
  //       <pre>{JSON.stringify(holdingsData, null, 2)}</pre>
  //     </>
  //   );
  // }
}
