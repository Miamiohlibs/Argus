import { Metadata } from 'next';
import ProjectForm from '@/components/ProjectForm';
import { checkUser } from '@/lib/checkUser';
import { updateProject } from '@/app/actions/projectActions';
import { getProject } from '@/app/actions/projectActions';
import getUserInfo from '@/lib/getUserInfo';
import { redirect } from 'next/navigation';
import { unauthorized } from 'next/navigation';
import logger from '@/lib/logger';
import NonOwnerAlert from '@/components/NonOwnerAlert';
import ProjectMetadata from '@/components/ProjectMetadata';
import ProjectButtons from '@/components/ProjectButtons';

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Edit Project Details | Argus',
    description: 'Update project name and notes',
  };
}

export default async function EditProjectPage({
  params,
}: EditProjectPageProps) {
  const currentUser = await checkUser();
  const { id } = await params;
  const response = await getProject({ id });
  const project = response.project;
  const {
    permissions: { isOwner, isOwnerish },
  } = await getUserInfo(id);

  if (!isOwnerish) {
    redirect(`/project/${id}`); // go to non-edit version of project page
  }

  logger.debug({ currentUser });
  logger.debug({ project });
  if (currentUser != undefined) {
    return (
      <>
        {/* this NonOwnerAlert has different conditions from others because the only one who should normally edit this page is the owner. */}
        {!isOwner && <NonOwnerAlert />}
        <h1 className="h2">Edit Project Details</h1>
        {project && <ProjectMetadata project={project} />}
        <ProjectButtons
          projectId={parseInt(id)}
          divClass="mb-3"
          canAssignCoEditors={isOwnerish}
          onPage="edit-project-details"
        />
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
