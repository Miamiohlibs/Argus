'use server';
import { Metadata } from 'next';
import ClientIframe from './ClientIframe';
import { unauthorized } from 'next/navigation';
import getUserInfo from '@/lib/getUserInfo';
import { getProject } from '@/app/actions/projectActions';
import ProjectMetadata from '@/components/ProjectMetadata';
import ProjectButtons from '@/components/ProjectButtons';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Print Slips | Argus',
    description: 'Print PDF slips for each project item',
  };
}

type PageProps = {
  params: Promise<{ id: string; specificBibEntry: string }>;
};

export default async function PdfWrapper({ params }: PageProps) {
  const { id, specificBibEntry } = await params;
  const { project, error } = await getProject({ id });
  const {
    permissions: { canPrint },
  } = await getUserInfo();
  if (!canPrint) {
    unauthorized();
  }
  return (
    <>
      {project && <ProjectMetadata project={project} />}
      <ProjectButtons projectId={parseInt(id)} onPage="slips" divClass="mb-4" />
      <ClientIframe />
    </>
  );
}
