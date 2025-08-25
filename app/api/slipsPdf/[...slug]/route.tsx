// app/api/pdf/route.tsx
import { NextRequest, NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
// import { RequestSlipProps } from '@/types/RequestSlipProps';
import { MultiPagePdf } from '@/components/MultipagePdf';
import getEntries from '@/app/actions/getEntries';
import getProject from '@/app/actions/getProject';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  // req: NextRequest,
  // context: { params: { slug: string[] } }
  // const id = '18';
  const { slug } = await params;
  // const { id } = await params;
  const id = slug;

  // const { params } = context;
  // const id = params.slug[0];
  // const id = await params.slug;
  // get items from project by id
  const { data } = await getEntries(id);
  const { project } = await getProject({ id });

  const entries = data?.entries ?? [];
  const items = entries.map((entry) => {
    console.log('One entry:', JSON.stringify(entry));
    const affiliation =
      project?.user.email && project?.user.email.includes('@miamioh.edu')
        ? 'Miami'
        : 'Other';
    return {
      author: entry.author,
      title: entry.itemTitle,
      callNumber: entry.callNumber ?? undefined,
      notes: entry.notes ?? undefined,
      location: entry.location,
      itemInfo: entry.items.map((item) => item.description).join(', '),
      userName: project?.user.name,
      userEmail: project?.user.email,
      affiliation,
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
