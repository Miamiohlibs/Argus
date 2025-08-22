// app/api/pdf/route.tsx
import { NextRequest, NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import { RequestSlipProps } from '@/types/RequestSlipProps';
import { MultiPagePdf } from '@/components/MultipagePdf';
import getEntries from '@/app/actions/getEntries';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const id = await params.slug;
  // get items from project by id
  const { data } = await getEntries(id);
  const entries = data?.entries ?? [];
  const items = entries.map((entry) => {
    return {
      author: entry.author,
      title: entry.itemTitle,
      callNumber: entry.callNumber,
    };
  });

  const stream = await renderToStream(<MultiPagePdf books={items} />);
  const filename = 'pullslip.pdf';
  // params.title !== null ? `Pull slip: ${params.title}.pdf` : 'pullslip.pdf';

  return new NextResponse(stream as any, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename=${filename}.pdf`,
    },
  });
}
