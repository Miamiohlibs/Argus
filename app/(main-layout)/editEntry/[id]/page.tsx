import { EntryWithItems } from '@/types/EntryWithItems';
import { bibHoldings } from '@/app/actions/almaSearch';
import getEntryById from '@/app/actions/getEntryById';
import {
  CondensedBibHoldings,
  AlmaItemDataPlusHoldingDetails,
} from '@/types/CondensedBibHoldings';
import BibResultsWrapper from '@/components/BibResultsWrapper';
import { Button } from 'react-bootstrap';
import Link from 'next/link';
import canEdit from '@/lib/canEdit';

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
  }: { data?: CondensedBibHoldings; error?: string } = await bibHoldings({
    mms_id: mmsId,
  });
  if (holdingsError) {
    return <>Error refreshing catalog data</>;
  }
  const canEditBool: boolean = await canEdit(projectId?.toString() ?? 0);
  return (
    <>
      <h1>
        Editing: <i>{holdingsData && holdingsData.bib_data.title}</i>
      </h1>
      <Link href={`/project/${projectId}`}>
        <Button variant="outline-secondary">Back to Project</Button>
      </Link>
      {/* Note : this section duplicates part of RecordSearchForm -- we should dedup the code */}
      <BibResultsWrapper
        projectId={projectId}
        holdingsData={holdingsData}
        actionType="edit"
        existingEntry={existingEntry}
        isEditor={canEditBool}
      />
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
