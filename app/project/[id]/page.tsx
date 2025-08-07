import getProject from '@/app/actions/getProject';
import RecordSearchButton from '@/components/RecordSearchButton';
import { checkUser } from '@/lib/checkUser';

export default async function ProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await checkUser();
  const { id } = await params;
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
      <p className="mt-5">Notes: {project?.notes}</p>
    </>
  );
}
