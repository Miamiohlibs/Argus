// app/api/slipsPdf/[...slub]/route.tsx
import { NextRequest, NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import { RequestSlipProps } from '@/types/RequestSlipProps';
import { MultiPagePdf } from '@/components/MultipagePdf';
import getEntries from '@/app/actions/getEntries';
import getProject from '@/app/actions/getProject';
import filenamify from 'filenamify';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const id = slug; // why this two-step? idk but it seemed necessary to build
  const { data } = await getEntries(id);
  const { project } = await getProject({ id });

  const entries = data?.entries ?? [];
  const items: RequestSlipProps[] = entries.map((entry) => {
    // console.log('One entry:', JSON.stringify(entry));

    return {
      author: entry.author,
      title: entry.itemTitle,
      callNumber: entry.callNumber ?? undefined,
      notes: entry.notes ?? undefined,
      date: entry.pub_date ?? undefined,
      location: entry.location,
      itemInfo: entry.items.map((item) => item.description).join(', '),
      userName: project?.user.name,
      userEmail: project?.user.email,
      userAffiliation: project?.user.affiliation ?? undefined,
      userStatus: project?.user.status ?? undefined,
    };
  });

  const stream = await renderToStream(<MultiPagePdf books={items} />);
  const filename = project?.title
    ? filenamify(`${project.title} - Pull Slips`)
    : 'pullslips';
  // console.log('filename:', filename);

  return new NextResponse(stream as any, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${filename}.pdf"`,
    },
  });
}
