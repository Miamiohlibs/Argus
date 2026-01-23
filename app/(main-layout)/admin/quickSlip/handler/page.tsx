import ClientQuickPdf from './ClientQuickPdf';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function QuickSlipHandler({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  return (
    <>
      <ClientQuickPdf searchParams={resolvedParams} />
    </>
  );
}
