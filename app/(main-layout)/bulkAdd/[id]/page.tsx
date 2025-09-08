import BulkAddForm from '@/components/BulkAddForm';
import getProject from '@/app/actions/getProject';
import { ProjectWithUserAndBib } from '@/types/ProjectWithUserAndBib';
import BackToProjectButton from '@/components/BackToProjectButton';

export default async function BulkAddPage({
  params,
}: {
  params: { id: string };
}) {
  const pageParams = await params;
  const projectResponse: {
    project?: ProjectWithUserAndBib;
    error?: string;
  } = await getProject({ id: pageParams.id });
  const { project, error } = projectResponse;
  if (project) {
    return (
      <>
        <h1>Bulk Add Items: {project?.title}</h1>
        <BackToProjectButton projectId={parseInt(pageParams.id)} />
        <BulkAddForm projectId={pageParams.id} />
      </>
    );
  } else {
    return <div>Project not found</div>;
  }
}
