import { Metadata } from 'next';
import CustomEntryForm from '@/components/CustomEntryForm';
import getEntryById from '@/app/actions/getEntryById';
import { EntryWithItems } from '@/types/EntryWithItems';
import getUserInfo from '@/lib/getUserInfo';
import NonOwnerAlert from '@/components/NonOwnerAlert';
import ProjectMetadata from '@/components/ProjectMetadata';
import ProjectButtons from '@/components/ProjectButtons';
import { getProject } from '@/app/actions/projectActions';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ projectId: number; slug: string }>;
}): Promise<Metadata> {
  const { slug, projectId } = await params;
  const title = slug ? 'Edit Custom Entry' : 'Add Custom Entry';

  return {
    title: `${title} | Argus`,
    description: `Enter item by hand`,
  };
}

export default async function CustomEntryPage({
  params,
}: {
  params: Promise<{ projectId: number; slug: string }>;
}) {
  const paramsUnpacked = await params;
  const slugs = await paramsUnpacked.slug;
  const projectId = await paramsUnpacked.projectId;
  const { project } = await getProject({ id: projectId.toString() });
  const existingEntryId: string = slugs ? slugs : 'new';
  const {
    permissions: { canEdit, canPrint, nonOwnerEditor },
  } = await getUserInfo(projectId);

  if (existingEntryId !== 'new') {
    // Load existing entry data

    const {
      data: existingEntry,
      error: existingEntryError,
    }: { data?: EntryWithItems; error?: string } = await getEntryById(
      existingEntryId
    );

    if (
      existingEntry &&
      existingEntry !== null &&
      typeof existingEntry === 'object' &&
      existingEntry !== undefined
    ) {
      return (
        <>
          {nonOwnerEditor && <NonOwnerAlert />}
          <h1 className="h2">
            Edit Custom Entry: <i>{existingEntry.itemTitle}</i>
          </h1>
          {projectId && (
            <ProjectButtons
              projectId={projectId}
              onPage="customEntry"
              canEdit={canEdit}
              canPrint={canPrint}
              divClass="mb-3"
            />
          )}
          {project && <ProjectMetadata project={project} />}
          <CustomEntryForm
            projectId={projectId}
            existingEntry={existingEntry}
            editable={canEdit}
          />
        </>
      );
    } else if (existingEntryError) {
      console.error('Error loading existing entry:', existingEntryError);
    }
  } else {
    return (
      <>
        {' '}
        {nonOwnerEditor && <NonOwnerAlert />}
        <h1 className="h2">Add Custom Entry</h1>
        {project && <ProjectMetadata project={project} />}
        {projectId && (
          <ProjectButtons
            projectId={projectId}
            onPage="customEntry"
            canEdit={canEdit}
            canPrint={canPrint}
            divClass="mb-3"
          />
        )}
        <CustomEntryForm projectId={projectId} editable={canEdit} />
      </>
    );
  }
}
