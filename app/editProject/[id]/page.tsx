import ProjectForm from '@/components/ProjectForm';
import { checkUser } from '@/lib/checkUser';
import { updateProject } from '@/app/actions/projectActions';
import getProject from '@/app/actions/getProject';
import { Project } from '@prisma/client';

interface EditProjectPageProps {
  params: { id: string };
}
export default async function EditProjectPage({
  params,
}: EditProjectPageProps) {
  const currentUser = await checkUser();
  const { id } = await params;
  const response = await getProject({ id });
  const project = response.project;

  console.log(currentUser);
  console.log(project);
  return (
    <>
      <ProjectForm
        user={currentUser}
        action={updateProject}
        project={project}
      />
    </>
  );
}
