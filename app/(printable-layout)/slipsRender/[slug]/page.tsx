'use server';
// app/api/slipsPdf/[...slug]/route.tsx
import logger from '@/lib/logger';
// import { MultiPagePdf } from '@/components/MultipagePdf';
import { MultiPageHtml } from '@/components/MutliPageHtml';
import getEntries from '@/app/actions/getEntries';
import { getProject } from '@/app/actions/projectActions';
// import filenamify from 'filenamify';
import { checkUser } from '@/lib/checkUser';
import generateRequestSlipItems from '@/lib/generateRequestSlipItems';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function RenderPages({ params }: PageProps) {
  const { slug } = await params;
  const [id, specificBibEntry] = slug.split('--');
  // note: specificBibEntry is optional and is ignored if absent
  const { data } = await getEntries(id, specificBibEntry);
  const { project } = await getProject({ id });
  const user = await checkUser();

  const entries = data?.entries ?? [];

  if (entries && project && user) {
    const items = generateRequestSlipItems(entries, project, user);
    return <MultiPageHtml books={items} />;
  }
  return (
    <>
      <p>Nothing to display</p>
      <p>ID: {id}</p>
      <p>Project: {project ? JSON.stringify(project) : 'not found'}</p>
      <p>ID: {id}</p>
      <p>Data:{JSON.stringify(data)}</p>
    </>
  );
}
