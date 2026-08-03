import { Metadata } from 'next';
import BulkAddForm from './BulkAddForm';
import { getProject } from '@/app/actions/projectActions';
import { ProjectWithUserAndBib } from '@/types/ProjectWithUserAndBib';
import ProjectButtons from '@/components/Projects/ProjectButtons';
import getUserInfo from '@/lib/getUserInfo';
import NonOwnerAlert from '@/components/NonOwnerAlert';
import ProjectMetadata from '@/components/ProjectMetadata';
import { unauthorized } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Bulk Add Items | Argus',
    description: 'Add multiple items to project',
  };
}

export default async function BulkAddPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const projectResponse: {
    project?: ProjectWithUserAndBib;
    error?: string;
  } = await getProject({ id });
  const { project, error } = projectResponse;
  const {
    permissions: { canEdit, canPrint, nonOwnerEditor, currentUserName },
  } = await getUserInfo(id);

  if (!canEdit) {
    return unauthorized();
  }
  if (project) {
    return (
      <>
        {nonOwnerEditor && <NonOwnerAlert />}
        <h1 className="text-3xl font-medium">
          Bulk Add Items: {project?.title}
        </h1>
        <ProjectMetadata project={project} />

        <ProjectButtons
          projectId={parseInt(id)}
          onPage="bulkAdd"
          canEdit={canEdit}
          canPrint={canPrint}
          divClass="mb-3"
        />
        <BulkAddForm
          projectId={id}
          currentUserName={currentUserName}
          nonOwnerEditor={nonOwnerEditor}
        />
      </>
    );
  } else {
    return <div>Project not found</div>;
  }
}
