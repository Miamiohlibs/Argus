import { RequestSlipProps } from '@/types/RequestSlipProps';
import ClientQuickPdf from './ClientQuickPdf';

interface PageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function QuickSlipHandler({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  //   console.log('PAGE resolvedParams:', resolvedParams);

  return (
    <>
      <ClientQuickPdf searchParams={resolvedParams} />
    </>
  );
}
