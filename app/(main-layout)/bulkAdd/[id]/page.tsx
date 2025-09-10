import BulkAddForm from '@/components/BulkAddForm';
import { getProject } from '@/app/actions/projectActions';
import { ProjectWithUserAndBib } from '@/types/ProjectWithUserAndBib';
import BackToProjectButton from '@/components/BackToProjectButton';

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
  if (project) {
    return (
      <>
        <h1 className="h2">Bulk Add Items: {project?.title}</h1>
        <BackToProjectButton projectId={parseInt(id)} />
        <BulkAddForm projectId={id} />
      </>
    );
  } else {
    return <div>Project not found</div>;
  }
}
