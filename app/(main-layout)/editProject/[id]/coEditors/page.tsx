import { Metadata } from 'next';
import { getProject } from '@/app/actions/projectActions';
import CoEditorTable from '@/components/CoEditorTable';
import ProjectMetadata from '@/components/ProjectMetadata';
import { notFound } from 'next/navigation';
import RemoveCoEditorButton from '@/components/RemoveCoEditorButton';
import ProjectButtons from '@/components/ProjectButtons';
import getUserInfo from '@/lib/getUserInfo';
import { unauthorized } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Update Co-Editors for Project | Argus',
    description: 'Add or remove project co-editors',
  };
}

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}
export default async function CoEditorPage({ params }: EditProjectPageProps) {
  const { id } = await params;
  const {
    permissions: { isOwner, isAdmin },
  } = await getUserInfo(id);
  if (!(isOwner || isAdmin)) {
    unauthorized();
  }

  const { project } = await getProject({ id });
  if (!project || project == null) {
    notFound();
  }
  return (
    <>
      <h1 className="h2">Update Co-Editor(s) on: {project?.title}</h1>
      <ProjectMetadata project={project} />
      <ProjectButtons
        projectId={project.id}
        canEdit={false}
        canPrint={false}
        onPage="Co-Editors"
      />
      {project.coEditors.length > 0 && (
        <>
          <h2 className="h3 mt-3">Current Co-Editors</h2>
          <ul>
            {project.coEditors.map((ed) => {
              return (
                <li key={ed.id}>
                  {ed.name}{' '}
                  <RemoveCoEditorButton
                    userId={ed.id}
                    projectId={project.id.toString()}
                  />
                </li>
              );
            })}
          </ul>
        </>
      )}
      <h2 className="h3 mt-5">Select Co-Editors</h2>
      <CoEditorTable projectId={id} />
    </>
  );
}
