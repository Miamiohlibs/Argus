import { checkUser } from '@/lib/checkUser';
import { getProject } from '@/app/actions/projectActions';
import { getPossibleCoEditors } from '@/app/actions/coEditors';
import CoEditorTable from '@/components/CoEditorTable';

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}
export default async function CoEditorPage({ params }: EditProjectPageProps) {
  const currentUser = await checkUser();
  const { id } = await params;
  //   const response = await getProject({ id });
  //   const response = await getPossibleCoEditors(id);
  //   return <pre>{JSON.stringify(response, null, 2)}</pre>;
  return <CoEditorTable projectId={id} />;
}
