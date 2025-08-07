import getProject from '@/app/actions/getProject';
import RecordSearchButton from '@/components/RecordSearchButton';
import { checkUser } from '@/lib/checkUser';
import getEntries from '@/app/actions/getEntries';

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
      <pre>{JSON.stringify(bibEntries.data?.entries.length, null, 2)}</pre>
      <p className="mt-5">Notes: {project?.notes}</p>

      {bibEntries && bibEntries.data?.entries ? (
        <ul>
          {bibEntries.data?.entries.length > 0 &&
            bibEntries.data?.entries?.map((entry) => (
              <li key={entry.id}>
                {entry.itemTitle}, {entry.author}, {entry.notes}, ,
                {entry.callNumber}
                {entry.location}
                {entry.items.length}
              </li>
            ))}
        </ul>
      ) : (
        <p>No bibliography entries found.</p>
      )}
    </>
  );
}
