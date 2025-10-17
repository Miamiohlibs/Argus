// app/api/slipsPdf/[...slub]/route.tsx
import logger from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import { RequestSlipProps } from '@/types/RequestSlipProps';
import { MultiPagePdf } from '@/components/MultipagePdf';
import getEntries from '@/app/actions/getEntries';
import { getProject } from '@/app/actions/projectActions';
import filenamify from 'filenamify';
import { checkUser } from '@/lib/checkUser';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const id = slug[0]; // why this two-step? idk but it seemed necessary to build
  const { data } = await getEntries(id);
  const { project } = await getProject({ id });
  const user = await checkUser();

  const entries = data?.entries ?? [];
  // return one slip per item (or one per bib if there are no items)
  const items: RequestSlipProps[] = entries.flatMap((entry) => {
    // Build item info strings for all items
    const itemInfos =
      entry.items?.map((item) => {
        let info: string = '';

        if (item.location_code || entry.location_codes) {
          info += `${item.location_name} (${item.location_code}) `;
        }
        if (item.call_number !== entry.callNumber) {
          info += `${item.call_number}`;
        }
        if (item.description) {
          info += item.description;
        }
        if (item.copy_id && parseInt(item.copy_id) > 1) {
          info += ` c.${item.copy_id}`;
        }

        return info.trim();
      }) ?? [];

    if (itemInfos.length > 0) {
      // One object per item, highlighting the index
      const locationStr = `${entry.location_display} (${entry.location_codes})`;
      return itemInfos.map((_, idx) => ({
        author: entry.author,
        title: entry.itemTitle,
        callNumber: entry.callNumber ?? undefined,
        notes: entry.notes ?? undefined,
        date: entry.pub_date ?? undefined,
        location: locationStr,
        ms: entry.items[0].ms ?? undefined,
        box: entry.items[0].box ?? undefined,
        folder: entry.items[0].folder ?? undefined,
        itemInfo: itemInfos, // full array of all items
        highlightedItemIndex: idx, // which one is current
        userName: project?.user.name,
        userEmail: project?.user.email,
        userAffiliation: project?.user.affiliation ?? undefined,
        userStatus: project?.user.status ?? undefined,
        personPrinting: user?.name ?? 'Unknown',
        projectName: project?.title,
      }));
    } else {
      // Fallback: no items, return a single object
      return [
        {
          author: entry.author,
          title: entry.itemTitle,
          callNumber: entry.callNumber ?? undefined,
          notes: entry.notes ?? undefined,
          date: entry.pub_date ?? undefined,
          location: `${entry.location_display} (${entry.location_codes})`,
          box: '',
          folder: '',
          ms: '',
          itemInfo: [],
          highlightedItemIndex: 0,
          userName: project?.user.name,
          userEmail: project?.user.email,
          userAffiliation: project?.user.affiliation ?? undefined,
          userStatus: project?.user.status ?? undefined,
          personPrinting: user?.name ?? 'Unknown',
          projectName: project?.title,
        },
      ];
    }
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
