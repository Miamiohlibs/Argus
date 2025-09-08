import BulkAddForm from '@/components/BulkAddForm';
import getProject from '@/app/actions/getProject';
import { ProjectWithUserAndBib } from '@/types/ProjectWithUserAndBib';
import BackToProjectButton from '@/components/BackToProjectButton';

export default async function BulkAddPage({
  params,
}: {
  params: { id: string };
}) {
  const projectResponse: {
    project?: ProjectWithUserAndBib;
    error?: string;
  } = await getProject({ id: params.id });
  const { project, error } = projectResponse;
  if (project) {
    return (
      <>
        <h1>Bulk Add Items: {project?.title}</h1>
        <BackToProjectButton projectId={parseInt(params.id)} />
        <BulkAddForm projectId={params.id} />
      </>
    );
  } else {
    return <div>Project not found</div>;
  }
}
