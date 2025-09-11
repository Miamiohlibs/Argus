import BulkAddForm from '@/components/BulkAddForm';
import { getProject } from '@/app/actions/projectActions';
import { ProjectWithUserAndBib } from '@/types/ProjectWithUserAndBib';
import ProjectButtons from '@/components/ProjectButtons';
import canEdit, { nonOwnerEditor } from '@/lib/canEdit';
import NonOwnerAlert from '@/components/NonOwnerAlert';

export default async function BulkAddPage({
  params,
}: {
  params: Promise<{ id: string }>;
  //   params: { id: string };
}) {
  const { id } = await params;
  const projectResponse: {
    project?: ProjectWithUserAndBib;
    error?: string;
  } = await getProject({ id });
  const { project, error } = projectResponse;
  const { canEditBool, nonOwnerAlert } = await nonOwnerEditor(parseInt(id));

  if (project) {
    return (
      <>
        <h1 className="h2">Bulk Add Items: {project?.title}</h1>
        <ProjectButtons
          projectId={parseInt(id)}
          onPage="bulkAdd"
          canEdit={canEditBool}
          divClass="mb-3"
        />
        <BulkAddForm projectId={id} />
      </>
    );
  } else {
    return <div>Project not found</div>;
  }
}
