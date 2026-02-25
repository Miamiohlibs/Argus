import { getCurrentUser } from '@/app/actions/getUser';
import { getProjects } from '@/app/actions/projectActions';
import UserDiagnosticInfo from '@/components/UserDiagnosticInfo';

export default async function MePage() {
  const { user, error: userError } = await getCurrentUser();
  const { projects, error: projectError } = await getProjects();

  return (
    <>
      {user && <UserDiagnosticInfo user={user} projects={projects ?? []} />}
      {process.env.NODE_ENV == 'development' && (
        <>
          <h2 className="mt-5">JSON</h2>
          <h3>User</h3>
          <pre>{JSON.stringify(user, null, 2)}</pre>
          <h3>Projects</h3>
          <pre>{JSON.stringify(projects, null, 2)}</pre>
        </>
      )}
    </>
  );
}
