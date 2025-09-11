import CustomEntryForm from '@/components/CustomEntryForm';
import getEntryById from '@/app/actions/getEntryById';
import { EntryWithItems } from '@/types/EntryWithItems';
import canEdit, { nonOwnerEditor } from '@/lib/canEdit';
import NonOwnerAlert from '@/components/NonOwnerAlert';
import ProjectMetadata from '@/components/ProjectMetadata';
import ProjectButtons from '@/components/ProjectButtons';
import { getProject } from '@/app/actions/projectActions';

// app/(main-layout)/customEntry/[projectId]/[slug]/page.tsx
// Type error: Type '{ params: { projectId: number; slug: string; }; }' does not satisfy the constraint 'PageProps'.
//   Types of property 'params' are incompatible.
//     Type '{ projectId: number; slug: string; }' is missing the following properties from type 'Promise<any>': then, catch, finally, [Symbol.toStringTag]

export default async function CustomEntryPage({
  params,
}: {
  params: Promise<{ projectId: number; slug: string }>;
}) {
  const paramsUnpacked = await params;
  const slugs = await paramsUnpacked.slug;
  const projectId = await paramsUnpacked.projectId;
  const { project } = await getProject({ id: projectId.toString() });
  // console.log(`projectId: ${projectId}`);
  // console.log('slugs', slugs);
  const existingEntryId: string = slugs ? slugs : 'new';
  // console.log(
  // `loading custom page with projectId: ${projectId} and existing: ${existingEntryId}`;
  // );
  const { canEditBool, nonOwnerAlert } = await nonOwnerEditor(projectId);

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
          {nonOwnerAlert && <NonOwnerAlert />}
          {projectId && (
            <ProjectButtons
              projectId={projectId}
              onPage="customEntry"
              canEdit={canEditBool}
              divClass="mb-3"
            />
          )}
          {project && <ProjectMetadata project={project} />}
          <CustomEntryForm
            projectId={projectId}
            existingEntry={existingEntry}
            editable={canEditBool}
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
        {nonOwnerAlert && <NonOwnerAlert />}
        {projectId && (
          <ProjectButtons
            projectId={projectId}
            onPage="customEntry"
            canEdit={canEditBool}
            divClass="mb-3"
          />
        )}
        {project && <ProjectMetadata project={project} />}
        <CustomEntryForm projectId={projectId} editable={canEditBool} />
      </>
    );
  }
}
