import ProjectForm from '@/components/ProjectForm';
import { createProject } from '@/app/actions/projectActions';
import getUserInfo from '@/lib/getUserInfo';
import { unauthorized } from 'next/navigation';

export default async function CreateProjectPage() {
  const {
    user,
    permissions: { isEditorOrAbove },
  } = await getUserInfo();
  const basePath = process.env.NEXT_PUBLIC_APP_BASEPATH ?? '/';

  if (isEditorOrAbove && user != undefined) {
    return (
      <>
        <ProjectForm user={user} action={createProject} basePath={basePath} />
      </>
    );
  } else {
    unauthorized();
  }
}
