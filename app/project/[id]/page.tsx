import getProject from '@/app/actions/getProject';
import RecordSearchButton from '@/components/RecordSearchButton';
import { checkUser } from '@/lib/checkUser';
import getEntries from '@/app/actions/getEntries';
import EntriesTable from '@/components/EntriesTable';

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

      {project?.user.clerkUserId == user?.clerkUserId && (
        <RecordSearchButton projectId={id} />
      )}

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
