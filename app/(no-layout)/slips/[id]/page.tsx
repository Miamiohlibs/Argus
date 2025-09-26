'use server';
import MultiPagePdf from './ClientMultipagePdf';
import { unauthorized } from 'next/navigation';
import getUserInfo from '@/lib/getUserInfo';

export default async function PdfWrapper() {
  const {
    permissions: { canPrint },
  } = await getUserInfo();
  if (!canPrint) {
    unauthorized();
  }
  return (
    <>
      <MultiPagePdf />
    </>
  );
}
