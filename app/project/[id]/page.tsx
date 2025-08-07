import getProject from '@/app/actions/getProject';
import RecordSearchButton from '@/components/RecordSearchButton';

export default async function ProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const { project, error } = await getProject({ id });
  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <>
      <h1>{project?.title}</h1>
      <p>Owner: {project?.user.name}</p>
      <RecordSearchButton projectId={id} />
      <p className="mt-5">Notes: {project?.notes}</p>
    </>
  );
}
