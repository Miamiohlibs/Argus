import getProject from '@/app/actions/getProject';
import RecordSearchButton from '@/components/RecordSearchButton';
import { checkUser } from '@/lib/checkUser';
import getEntries from '@/app/actions/getEntries';
import EntriesTable from '@/components/EntriesTable';
import Link from 'next/link';
import { Button } from 'react-bootstrap';

export default async function ProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await checkUser();
  const { id } = await params;
  const bibEntries = await getEntries(id);
  const { project, error } = await getProject({ id });

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <>
      <h1>{project?.title}</h1>
      <p>Owner: {project?.user.name}</p>

      <div className={'mb-3'} id={'project tools'}>
        {project?.user.clerkUserId == user?.clerkUserId && (
          <RecordSearchButton projectId={id} className={'me-2'} />
        )}

        <Link href={`/printSlips/${id}`}>
          <Button variant="outline-primary" size="sm">
            Print Slips
          </Button>
        </Link>
      </div>

      {bibEntries && bibEntries.data?.entries ? (
        <EntriesTable entries={bibEntries.data?.entries} />
      ) : (
        <p>No bibliography entries found.</p>
      )}
      <p className="mt-5">Notes: {project?.notes}</p>
      <pre>{JSON.stringify(bibEntries.data?.entries, null, 2)}</pre>
    </>
  );
}
