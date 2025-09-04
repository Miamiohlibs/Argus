import CustomEntryForm from '@/components/CustomEntryForm';
import { param } from 'jquery';
import getEntryById from '@/app/actions/getEntryById';
import { EntryWithItems } from '@/types/EntryWithItems';
import BackToProjectButton from '@/components/BackToProjectButton';

export default async function CustomEntryPage({
  params,
}: {
  params: { projectId: number; slug: string };
}) {
  const paramsUnpacked = await params;
  const slugs = await paramsUnpacked.slug;
  const projectId = await paramsUnpacked.projectId;
  console.log(`projectId: ${projectId}`);
  console.log('slugs', slugs);
  const existingEntryId: string = slugs ? slugs : 'new';
  console.log(
    `loading custom page with projectId: ${projectId} and existing: ${existingEntryId}`
  );
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
          <BackToProjectButton projectId={projectId} />
          <CustomEntryForm
            projectId={projectId}
            existingEntry={existingEntry}
          />
        </>
      );
    } else if (existingEntryError) {
      console.error('Error loading existing entry:', existingEntryError);
    }
  }
  return (
    <>
      <CustomEntryForm projectId={projectId} />
    </>
  );
}
