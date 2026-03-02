import ClientQuickPages from './ClientQuickPages';
import MainButtons from '@/components/MainButtons';
import getUserInfo from '@/lib/getUserInfo';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function QuickSlipHandler({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const {
    user,
    permissions: { isEditorOrAbove, canPrint },
  } = await getUserInfo();

  return (
    <>
      <div className="mb-3">
        <MainButtons canPrint={canPrint} isEditorOrAbove={isEditorOrAbove} />
      </div>
      <ClientQuickPages searchParams={resolvedParams} />
    </>
  );
}
