'use server';
import { Metadata } from 'next';
import ClientIframe from '../ClientIframe';
import { redirect, unauthorized } from 'next/navigation';
import getUserInfo from '@/lib/getUserInfo';
import { getProject } from '@/app/actions/projectActions';
import { getSelectedEntriesCookie } from '@/lib/selectedEntriesCookie';
import ProjectMetadata from '@/components/ProjectMetadata';
import ProjectButtons from '@/components/Projects/ProjectButtons';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Print Slips | Argus',
    description: 'Print slips for selected project items',
  };
}

export default async function PagesWrapper() {
  const selection = await getSelectedEntriesCookie();
  if (!selection) {
    // no (or expired) selection to print -- nothing to render this page for
    redirect('/');
  }
  const { projectId } = selection;
  const { project } = await getProject({ id: projectId });
  const {
    permissions: { canPrint },
  } = await getUserInfo(projectId);
  if (!canPrint) {
    unauthorized();
  }
  return (
    <>
      {project && <ProjectMetadata project={project} />}
      <ProjectButtons
        projectId={parseInt(projectId)}
        onPage="slips"
        divClass="mb-4"
      />
      <ClientIframe src="/slipsRender/selected" />
    </>
  );
}
