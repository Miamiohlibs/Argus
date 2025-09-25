import { EntryWithItems } from '@/types/EntryWithItems';
import { bibHoldings } from '@/app/actions/almaSearch';
import getEntryById from '@/app/actions/getEntryById';
import { CondensedBibHoldings } from '@/types/CondensedBibHoldings';
import BibResultsWrapper from '@/components/BibResultsWrapper';
import getUserInfo from '@/lib/getUserInfo';
import NonOwnerAlert from '@/components/NonOwnerAlert';
import ProjectButtons from '@/components/ProjectButtons';
import ProjectMetadata from '@/components/ProjectMetadata';
import { getProject } from '@/app/actions/projectActions';

export default async function EditEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const {
    data: existingEntry,
    error: existingEntryError,
  }: { data?: EntryWithItems; error?: string } = await getEntryById(id);
  if (existingEntryError) {
    return <>Unable to retrieve existing entry</>;
  }
  const projectId = existingEntry?.projectId ?? 0;
  const { project } = await getProject({ id: projectId.toString() });

  const mmsId = existingEntry?.almaId ?? '';
  const {
    permissions: { canEdit, canPrint, nonOwnerEditor },
  } = await getUserInfo(projectId);

  const {
    data: holdingsData,
    error: holdingsError,
  }: { data?: CondensedBibHoldings; error?: string } = await bibHoldings({
    mms_id: mmsId,
  });
  if (holdingsError) {
    return <>Error refreshing catalog data</>;
  }
  return (
    <>
      {nonOwnerEditor && <NonOwnerAlert />}
      <h1 className="h2">
        Editing: <i>{holdingsData && holdingsData.bib_data.title}</i>
      </h1>
      <ProjectButtons
        canEdit={canEdit}
        canPrint={canPrint}
        onPage="editEntry"
        projectId={projectId}
        divClass="mb-2"
      />
      {project && <ProjectMetadata project={project} />}
      {/* Note : this section duplicates part of RecordSearchForm -- we should dedup the code */}
      <BibResultsWrapper
        projectId={projectId}
        holdingsData={holdingsData}
        actionType="edit"
        existingEntry={existingEntry}
        isEditor={canEdit}
      />
    </>
  );
}
