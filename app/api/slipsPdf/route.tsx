// app/api/pdf/route.tsx
import { NextRequest, NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import { RequestSlipProps } from '@/types/RequestSlipProps';
import { MultiPagePdf } from '@/components/MultipagePdf';

export async function GET(req: NextRequest) {
  const books: RequestSlipProps[] = [
    {
      author: 'Wegener, Larry Edward',
      title:
        "A concordance to Herman Melville's Clarel, a poem and pilgrimage in the Holy Land",
      callNumber: 'PS2384 .C529 1979',
    },
    {
      author: 'Melville, Herman',
      title: 'Billy Budd',
      callNumber: 'PS2384 .B5 1948',
    },
  ];
  const stream = await renderToStream(<MultiPagePdf books={books} />);
  const filename = 'pullslip.pdf';
  // params.title !== null ? `Pull slip: ${params.title}.pdf` : 'pullslip.pdf';

  return new NextResponse(stream as any, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename=${filename}.pdf`,
    },
  });
}
