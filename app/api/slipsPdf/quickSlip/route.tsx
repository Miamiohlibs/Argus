// app/api/slipsPdf/[...slug]/route.tsx
import logger from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import { RequestSlipProps } from '@/types/RequestSlipProps';
import { MultiPagePdf } from '@/components/MultipagePdf';
import getEntries from '@/app/actions/getEntries';
import { getProject } from '@/app/actions/projectActions';
import filenamify from 'filenamify';
import { checkUser } from '@/lib/checkUser';

function createItemFromReq(req: NextRequest) {
  const params = Object.fromEntries(req.nextUrl.searchParams.entries());
  console.log('params:', params);

  const item: RequestSlipProps = { purpose: 'Quick Slip' };
  if (params.hasOwnProperty('title') && typeof params.title == 'string') {
    item.title = params.title;
  }

  if (params.hasOwnProperty('author') && typeof params.author == 'string') {
    item.author = params.author;
  }

  if (params.hasOwnProperty('notes') && typeof params.notes == 'string') {
    item.notes = params.notes;
  }

  // Question: we pass location and location_names -- what to use?
  if (params.hasOwnProperty('location') && typeof params.location == 'string') {
    item.location = params.location;
  }

  if (
    params.hasOwnProperty('date_of_publication') &&
    typeof params.date_of_publication == 'string'
  ) {
    item.date = params.date_of_publication;
  }

  if (
    params.hasOwnProperty('call_number') &&
    typeof params.call_number == 'string'
  ) {
    item.callNumber = params.call_number;
  }

  if (
    params.hasOwnProperty('publisher_const') &&
    typeof params.publisher_const == 'string'
  ) {
    item.publisher = params.publisher_const;
  }
  return item;
}

export async function GET(req: NextRequest) {
  const item = createItemFromReq(req);
  const items = [item];

  const stream = await renderToStream(<MultiPagePdf books={items} />);
  const filename = 'Quick Slip';
  //   project?.title
  //     ? filenamify(`${project.title} - Pull Slips`)
  //     : 'pullslips';
  // logger.verbose('filename:', filename);

  return new NextResponse(stream as any, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${filename}.pdf"`,
    },
  });
}
