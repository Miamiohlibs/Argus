import { getProject } from '@/app/actions/projectActions';
import getEntries from '@/app/actions/getEntries';
import EntriesTable from '@/components/EntriesTable';
import getUserInfo from '@/lib/getUserInfo';
import ProjectButtons from '@/components/ProjectButtons';

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const bibEntries = await getEntries(id);
  const { project, error } = await getProject({ id });

  if (error) {
    return <div>Error: {error}</div>;
  }
  const {
    user,
    permissions: { canEdit, canPrint, isOwner, isAdmin },
  } = await getUserInfo(id);

  return (
    <>
      <h1 className="h2">{project?.title}</h1>
      <p>Owner: {project?.user.name}</p>
      <div className={'mb-3'} id={'project-tools'}>
        <ProjectButtons
          projectId={parseInt(id)}
          canEdit={canEdit}
          canPrint={canPrint}
          canAssignCoEditors={isAdmin || isOwner}
          onPage="project"
        />
      </div>

      {bibEntries && bibEntries.data?.entries && user ? (
        <EntriesTable entries={bibEntries.data?.entries} canEdit={canEdit} />
      ) : (
        <p>No bibliography entries found.</p>
      )}
      <p className="mt-5">Notes: {project?.notes}</p>
      {process.env.NEXT_PUBLIC_IS_DEV_ENV && (
        <pre>{JSON.stringify(bibEntries.data?.entries, null, 2)}</pre>
      )}
    </>
  );
}
