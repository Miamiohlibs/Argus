'use server';
import { Metadata } from 'next';
import MultiPagePdf from './ClientMultipagePdf';
import { unauthorized } from 'next/navigation';
import getUserInfo from '@/lib/getUserInfo';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Print Slips | Argus',
    description: 'Print PDF slips for each project item',
  };
}

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
