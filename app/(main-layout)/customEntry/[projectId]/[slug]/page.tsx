import CustomEntryForm from '@/components/CustomEntryForm';
import { param } from 'jquery';

export default async function CustomEntryPage({
  params,
}: {
  params: { projectId: number; slug: string };
}) {
  const slugs = params.slug;
  const projectId = params.projectId;
  console.log(`projectId: ${projectId}`);
  console.log('slugs', slugs);
  const existingEntryId: string = slugs ? slugs : 'new';
  console.log(
    `loading custom page with projectId: ${projectId} and existing: ${existingEntryId}`
  );

  return (
    <>
      <CustomEntryForm projectId={projectId} />
    </>
  );
}
