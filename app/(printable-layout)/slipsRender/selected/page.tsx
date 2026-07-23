'use server';
import { MultiPageHtml } from '@/components/RequestSlips/MultiPageHtml';
import getEntries from '@/app/actions/getEntries';
import { getProject } from '@/app/actions/projectActions';
import { checkUser } from '@/lib/checkUser';
import generateRequestSlipItems from '@/lib/generateRequestSlipItems';
import { getSelectedEntriesCookie } from '@/lib/selectedEntriesCookie';

export default async function RenderPages() {
  const selection = await getSelectedEntriesCookie();
  if (!selection) {
    return <p>Nothing to display</p>;
  }
  const { projectId, entryIds } = selection;
  const { data } = await getEntries(projectId, entryIds);
  const { project } = await getProject({ id: projectId });
  const user = await checkUser();

  const entries = data?.entries ?? [];

  if (entries.length > 0 && project && user) {
    const items = generateRequestSlipItems(entries, project, user);
    return <MultiPageHtml books={items} />;
  }
  return (
    <>
      <p>Nothing to display</p>
      <p>Project: {project ? JSON.stringify(project) : 'not found'}</p>
      <p>Data: {JSON.stringify(data)}</p>
    </>
  );
}
