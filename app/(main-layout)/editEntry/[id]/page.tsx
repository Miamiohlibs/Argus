import { Metadata } from 'next';
import { EntryWithItems } from '@/types/EntryWithItems';
import { fetchCatalogEntry } from '@/app/actions/catalogSearch';
import getEntryById from '@/app/actions/getEntryById';
import { CatalogSearchResult } from '@/lib/catalogs/types';
import BibResultsWrapper from '@/components/RecordSearchForm/BibResultsWrapper';
import CustomEntryForm from '@/components/CustomEntryForm';
import getUserInfo from '@/lib/getUserInfo';
import NonOwnerAlert from '@/components/NonOwnerAlert';
import ProjectButtons from '@/components/Projects/ProjectButtons';
import ProjectMetadata from '@/components/Projects/ProjectMetadata';
import { getProject } from '@/app/actions/projectActions';

type MetadataProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: MetadataProps): Promise<Metadata> {
  const { id } = await params;
  const {
    data: existingEntry,
    error: existingEntryError,
  }: { data?: EntryWithItems; error?: string } = await getEntryById(id);
  if (existingEntry !== undefined) {
    return {
      title: `${existingEntry.itemTitle} | Argus`,
      description: `Existing Item Page: ${existingEntry.itemTitle}`,
    };
  } else {
    return {
      title: 'Item Not Found | Argus',
    };
  }
}

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

  const {
    permissions: { canEdit, canPrint, nonOwnerEditor, currentUserName },
  } = await getUserInfo(projectId);

  if (existingEntry?.catalog === 'CUSTOM') {
    return (
      <>
        {nonOwnerEditor && <NonOwnerAlert />}
        <h1 className="text-3xl font-medium">
          Edit Custom Entry: <i>{existingEntry.itemTitle}</i>
        </h1>
        <ProjectButtons
          canEdit={canEdit}
          canPrint={canPrint}
          onPage="editEntry"
          projectId={projectId}
          divClass="mb-2"
        />
        {project && <ProjectMetadata project={project} />}
        <CustomEntryForm
          projectId={projectId}
          existingEntry={existingEntry}
          editable={canEdit}
          currentUserName={currentUserName}
          nonOwnerEditor={nonOwnerEditor}
        />
      </>
    );
  }

  const {
    data: holdingsData,
    error: holdingsError,
  }: { data?: CatalogSearchResult; error?: string } = await fetchCatalogEntry(
    existingEntry?.catalog ?? 'ALMA',
    existingEntry?.catalogId ?? '',
  );
  if (holdingsError) {
    return (
      <>
        <h1>Error</h1>
        <p>Error refreshing catalog data: {holdingsError}.</p>
        <p>ID: {id}</p>
      </>
    );
  }
  return (
    <>
      {nonOwnerEditor && <NonOwnerAlert />}
      <h1 className="text-3xl font-medium">
        Editing: <i>{holdingsData && holdingsData.bibData.itemTitle}</i>
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
        currentUserName={currentUserName}
        nonOwnerEditor={nonOwnerEditor}
      />
    </>
  );
}
