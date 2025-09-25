'use server';
// import { useParams } from 'next/navigation';
import MultiPagePdf from './ClientMultipagePdf';
import { unauthorized } from 'next/navigation';
import { canPrint } from '@/lib/canEdit';

export default async function PdfWrapper() {
  const canPrintBool = (await canPrint()) ?? false;
  if (!canPrintBool) {
    unauthorized();
  }
  return (
    <>
      <MultiPagePdf />
    </>
  );
}
