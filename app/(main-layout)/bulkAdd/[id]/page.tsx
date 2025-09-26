import BulkAddForm from '@/components/BulkAddForm';
import { getProject } from '@/app/actions/projectActions';
import { ProjectWithUserAndBib } from '@/types/ProjectWithUserAndBib';
import ProjectButtons from '@/components/ProjectButtons';
import getUserInfo from '@/lib/getUserInfo';
import NonOwnerAlert from '@/components/NonOwnerAlert';
import ProjectMetadata from '@/components/ProjectMetadata';
import { unauthorized } from 'next/navigation';

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
    permissions: { canEdit, canPrint, nonOwnerEditor },
  } = await getUserInfo(id);

  if (canEdit) {
    return unauthorized();
  }
  if (project) {
    return (
      <>
        {nonOwnerEditor && <NonOwnerAlert />}
        <h1 className="h2">Bulk Add Items: {project?.title}</h1>
        <ProjectButtons
          projectId={parseInt(id)}
          onPage="bulkAdd"
          canEdit={canEdit}
          canPrint={canPrint}
          divClass="mb-3"
        />
        <ProjectMetadata project={project} />
        <BulkAddForm projectId={id} />
      </>
    );
  } else {
    return <div>Project not found</div>;
  }
}
