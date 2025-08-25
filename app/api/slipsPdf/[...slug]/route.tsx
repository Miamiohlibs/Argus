// app/api/pdf/route.tsx
import { NextRequest, NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import { RequestSlipProps } from '@/types/RequestSlipProps';
import { MultiPagePdf } from '@/components/MultipagePdf';
import getEntries from '@/app/actions/getEntries';
import getProject from '@/app/actions/getProject';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const id = await params.slug;
  // get items from project by id
  const { data } = await getEntries(id);
  const { project } = await getProject({ id });

  const entries = data?.entries ?? [];
  const items = entries.map((entry) => {
    console.log('One entry:', JSON.stringify(entry));
    return {
      author: entry.author,
      title: entry.itemTitle,
      callNumber: entry.callNumber,
      notes: entry.notes,
      location: entry.location,
      itemInfo: entry.items.map((item) => item.description).join(', '),
      userName: project?.user.name,
      userEmail: project?.user.email,
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
