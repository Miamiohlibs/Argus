// app/api/slipsPdf/[...slug]/route.tsx
import logger from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import { MultiPagePdf } from '@/components/MultipagePdf';
import getEntries from '@/app/actions/getEntries';
import { getProject } from '@/app/actions/projectActions';
import filenamify from 'filenamify';
import { checkUser } from '@/lib/checkUser';
import generateRequestSlipItems from '@/lib/generateRequestSlipItems';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const [id, specificBibEntry] = slug[0].split('--');
  // note: specificBibEntry is optional and is ignored if absent
  const { data } = await getEntries(id, specificBibEntry);
  const { project } = await getProject({ id });
  const user = await checkUser();

  const entries = data?.entries ?? [];

  if (entries && project && user) {
    const items = generateRequestSlipItems(entries, project, user);

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
}
