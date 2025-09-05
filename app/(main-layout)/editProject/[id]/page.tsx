import ProjectForm from '@/components/ProjectForm';
import { checkUser } from '@/lib/checkUser';
import { updateProject } from '@/app/actions/projectActions';
import getProject from '@/app/actions/getProject';
// import { Project } from '@prisma/client';
import canEdit, { nonOwnerEditor } from '@/lib/canEdit';
import { redirect } from 'next/navigation';
import { unauthorized } from 'next/navigation';
import logger from '@/lib/logger';
import NonOwnerAlert from '@/components/NonOwnerAlert';

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}
export default async function EditProjectPage({
  params,
}: EditProjectPageProps) {
  const currentUser = await checkUser();
  const { id } = await params;
  const response = await getProject({ id });
  const project = response.project;
  const isEditor = await canEdit(id);
  const { nonOwnerAlert } = await nonOwnerEditor(parseInt(id, 10));

  if (!isEditor) {
    redirect(`/project/${id}`); // go to non-edit version of project page
  }

  logger.debug({ currentUser });
  logger.debug({ project });
  if (currentUser != undefined) {
    return (
      <>
        {nonOwnerAlert && <NonOwnerAlert />}
        <ProjectForm
          user={currentUser}
          action={updateProject}
          project={project}
          basePath={process.env.NEXT_PUBLIC_APP_BASEPATH ?? '/'}
        />
      </>
    );
  } else {
    unauthorized();
  }
}
