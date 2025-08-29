// app/api/slipsPdf/[...slub]/route.tsx
import logger from '@/lib/logger';
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
    // logger.verbose('One entry:', JSON.stringify(entry));

    // format item info -- comma separate if minimal info; separate with newlines if longer

    return {
      author: entry.author,
      title: entry.itemTitle,
      callNumber: entry.callNumber ?? undefined,
      notes: entry.notes ?? undefined,
      date: entry.pub_date ?? undefined,
      location: entry.location,
      itemInfo:
        entry.items &&
        entry.items.map((item) => {
          let info: string = '';
          // let partCount = 0;
          if (item.location != entry.location) {
            info += `(${item.location}) `;
            // partCount++;
          }
          if (item.call_number != entry.callNumber) {
            info += `${item.call_number}`;
            // partCount++;
          }
          if (item.description) {
            info += item.description;
          }
          if (item.copy_id && parseInt(item.copy_id) > 1) {
            info += ` c.${item.copy_id}`;
            // partCount++;
          }
          return info;
        }),
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
  // logger.verbose('filename:', filename);

  return new NextResponse(stream as any, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${filename}.pdf"`,
    },
  });
}
