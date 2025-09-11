import { getProject } from '@/app/actions/projectActions';
import { checkUser } from '@/lib/checkUser';
import getEntries from '@/app/actions/getEntries';
import EntriesTable from '@/components/EntriesTable';
import canEdit from '@/lib/canEdit';
import ProjectButtons from '@/components/ProjectButtons';

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
      <h1 className="h2">{project?.title}</h1>
      <p>Owner: {project?.user.name}</p>
      {/* <p>Is Basic(lib): {isBasicUserBool.toString()}</p>
      <p>Is Admin(lib): {isOwnerBool.toString()}</p>
      <p>Is Owner(lib): {isAdminBool.toString()}</p>
      <p>Can Edit(lib): {canEditBool.toString()}</p> */}
      <div className={'mb-3'} id={'project tools'}>
        <ProjectButtons
          projectId={parseInt(id)}
          canEdit={canEditBool}
          onPage="project"
        />
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
      {process.env.NEXT_PUBLIC_IS_DEV_ENV && (
        <pre>{JSON.stringify(bibEntries.data?.entries, null, 2)}</pre>
      )}
    </>
  );
}
