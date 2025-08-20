import ProjectForm from '@/components/ProjectForm';
import { checkUser } from '@/lib/checkUser';
import { createProject } from '@/app/actions/projectActions';
import { isEditorOrAbove } from '@/lib/canEdit';
import { unauthorized } from 'next/navigation';

export default async function CreateProjectPage() {
  const currentUser = await checkUser();
  // const currentUser: User | null = await checkUser();
  const isEditor = await isEditorOrAbove();

  if (isEditor) {
    return (
      <>
        <ProjectForm user={currentUser} action={createProject} />
      </>
    );
  } else {
    unauthorized();
  }
}
