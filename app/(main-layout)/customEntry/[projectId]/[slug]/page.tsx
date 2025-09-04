import CustomEntryForm from '@/components/CustomEntryForm';
import { param } from 'jquery';
import getEntryById from '@/app/actions/getEntryById';
import { EntryWithItems } from '@/types/EntryWithItems';
import canEdit from '@/lib/canEdit';
import { currentUser } from '@clerk/nextjs/server';
import { checkUser } from '@/lib/checkUser';

export default async function CustomEntryPage({
  params,
}: {
  params: { projectId: number; slug: string };
}) {
  const paramsUnpacked = await params;
  const slugs = await paramsUnpacked.slug;
  const projectId = await paramsUnpacked.projectId;
  // console.log(`projectId: ${projectId}`);
  // console.log('slugs', slugs);
  const existingEntryId: string = slugs ? slugs : 'new';
  // console.log(
  //   `loading custom page with projectId: ${projectId} and existing: ${existingEntryId}`
  // );
  if (existingEntryId !== 'new') {
    // Load existing entry data
    const canEditBool: boolean = await canEdit(projectId?.toString() ?? 0);

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
          <CustomEntryForm
            projectId={projectId}
            existingEntry={existingEntry}
            editable={canEditBool}
          />
        </>
      );
    } else if (existingEntryError) {
      console.error('Error loading existing entry:', existingEntryError);
    } else if (canEditBool) {
      return (
        <>
          <CustomEntryForm projectId={projectId} editable={canEditBool} />
        </>
      );
    }
  }
}
