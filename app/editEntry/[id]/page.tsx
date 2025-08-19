import { EntryWithItems } from '@/types/EntryWithItems';
import { bibHoldings } from '@/app/actions/almaSearch';
import getEntryById from '@/app/actions/getEntryById';
import { CondensedBibHoldings } from '@/types/CondensedBibHoldings';
import BibResultsWrapper from '@/components/BibResultsWrapper';
import { Button } from 'react-bootstrap';
import Link from 'next/link';
import { currentUser } from '@clerk/nextjs/server';
import checkAccess from '@/lib/checkAccess';

export default async function EditEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const clerkUser = await currentUser();
  const isAdmin =
    (await checkAccess({
      permittedRoles: ['admin', 'superadmin'],
      inline: true,
    })) !== false; // checkAccess will return admin level if not false, so look for not false
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
  const isOwner: boolean =
    clerkUser !== undefined &&
    existingEntry !== undefined &&
    existingEntry?.project.userId == clerkUser?.id;

  return (
    <>
      <h1>
        Editing: <i>{holdingsData && holdingsData[0].bib_data.title}</i>
        <br /> isAdmin: {isAdmin.toString()}
        <br /> isOwner: {isOwner.toString()}
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
        isOwner={isOwner}
        isAdmin={isAdmin}
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
