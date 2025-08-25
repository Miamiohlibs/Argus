// app/api/pdf/route.tsx
import { NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
// import { RequestSlipProps } from '@/types/RequestSlipProps';
// import { MultiPagePdf } from '@/components/MultipagePdf';
// import getEntries from '@/app/actions/getEntries';
import RequestSlip from '@/components/RequestSlip';

export async function GET() {
  //   req: NextRequest,
  //   { params }: { params: { slug: string } }
  //   const id = await params.slug;
  // get items from project by id
  //   const { data } = await getEntries(id);
  //   const entries = data?.entries ?? [];
  //   const items = entries.map((entry) => {
  //     return {
  //       author: entry.author,
  //       title: entry.itemTitle,
  //       callNumber: entry.callNumber,
  //     };
  //   });

  //   const stream = await renderToStream(<MultiPagePdf books={items} />);
  const stream = await renderToStream(<RequestSlip />);
  const filename = 'pullslip.pdf';
  // params.title !== null ? `Pull slip: ${params.title}.pdf` : 'pullslip.pdf';

  // Convert the stream to a Buffer
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  const pdfBuffer = Buffer.concat(chunks);

  return new NextResponse(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename=${filename}.pdf`,
    },
  });
}
