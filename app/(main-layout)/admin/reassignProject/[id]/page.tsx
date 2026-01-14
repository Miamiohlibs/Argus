import { getProject } from '@/app/actions/projectActions';
import { updateProjectOwner } from '@/app/actions/projectActions';
import ReassignmentForm from './ReassignmentForm';
import getUsers from '@/app/actions/getUsers';
import getUserInfo from '@/lib/getUserInfo';

export default async function ReassignProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const {
    user,
    permissions: { isAdmin },
  } = await getUserInfo(id);
  const { project, error: projectError } = await getProject({ id });
  const { users, error: userError } = await getUsers([
    'editor',
    'admin',
    'superadmin',
  ]);

  if (project && users && user) {
    return (
      <>
        <h1>Reassign Project Owner: {project?.title}</h1>
        <b>Current Owner: {project?.user.name}</b>
        <ReassignmentForm
          projectId={project.id}
          action={updateProjectOwner}
          users={users}
          actorId={user.id}
        />
      </>
    );
  }
}
