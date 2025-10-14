import { checkUser } from '@/lib/checkUser';
import { getProject } from '@/app/actions/projectActions';
import { getPossibleCoEditors } from '@/app/actions/coEditors';
import CoEditorTable from '@/components/CoEditorTable';
import ProjectMetadata from '@/components/ProjectMetadata';
import { notFound } from 'next/navigation';

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}
export default async function CoEditorPage({ params }: EditProjectPageProps) {
  // const currentUser = await checkUser();
  const { id } = await params;
  const { project } = await getProject({ id });
  //   const response = await getPossibleCoEditors(id);
  //   return <pre>{JSON.stringify(response, null, 2)}</pre>;
  if (!project || project == null) {
    notFound();
  }
  return (
    <>
      <h1 className="h2">Add Co-Editor(s) on: {project?.title}</h1>
      <ProjectMetadata project={project} />
      <CoEditorTable projectId={id} />
    </>
  );
}
