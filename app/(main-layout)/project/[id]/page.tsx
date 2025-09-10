import { getProject } from '@/app/actions/projectActions';
import RecordSearchButton from '@/components/RecordSearchButton';
import { checkUser } from '@/lib/checkUser';
import getEntries from '@/app/actions/getEntries';
import EntriesTable from '@/components/EntriesTable';
import Link from 'next/link';
import { Button } from 'react-bootstrap';
// import canEdit from '@/lib/canEdit';
import canEdit from '@/lib/canEdit';
// import { duplicateProject } from '@/app/actions/projectActions';
import DuplicateProjectButton from '@/components/DuplicateProjectButton';

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await checkUser();
  const { id } = await params;
  const bibEntries = await getEntries(id);
  const { project, error } = await getProject({ id });

  if (error) {
    return <div>Error: {error}</div>;
  }
  // const isBasicUserBool = await isBasicUser();
  // const isOwnerBool = await isOwner(id);
  // const isAdminBool = await isAdmin();
  const canEditBool = await canEdit(id);

  return (
    <>
      <h1>{project?.title}</h1>
      <p>Owner: {project?.user.name}</p>
      {/* <p>Is Basic(lib): {isBasicUserBool.toString()}</p>
      <p>Is Admin(lib): {isOwnerBool.toString()}</p>
      <p>Is Owner(lib): {isAdminBool.toString()}</p>
      <p>Can Edit(lib): {canEditBool.toString()}</p> */}
      <div className={'mb-3'} id={'project tools'}>
        {canEditBool && (
          <RecordSearchButton projectId={id} className={'me-2'} />
        )}

        <Link href={`/slips/${id}`}>
          <Button variant="outline-primary" size="sm" className={'me-2'}>
            Print Slips
          </Button>
        </Link>

        {canEditBool && <DuplicateProjectButton id={id.toString()} />}
      </div>

      {bibEntries && bibEntries.data?.entries && user ? (
        <EntriesTable
          entries={bibEntries.data?.entries}
          user={user}
          ownerClerkId={project?.user.clerkUserId ?? ''}
        />
      ) : (
        <p>No bibliography entries found.</p>
      )}
      <p className="mt-5">Notes: {project?.notes}</p>
      <pre>{JSON.stringify(bibEntries.data?.entries, null, 2)}</pre>
    </>
  );
}
