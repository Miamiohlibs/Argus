import ProjectForm from '@/components/ProjectForm';
import { checkUser } from '@/lib/checkUser';
import { createProject } from '@/app/actions/projectActions';

export default async function CreateProjectPage() {
  const currentUser = await checkUser();
  // const currentUser: User | null = await checkUser();

  // console.log(currentUser);
  return (
    <>
      <ProjectForm user={currentUser} action={createProject} />
    </>
  );
}
