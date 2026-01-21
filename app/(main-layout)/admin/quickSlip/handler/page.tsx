import { RequestSlipProps } from '@/types/RequestSlipProps';
import ClientQuickPdf from './ClientQuickPdf';

// function assignRequestSlipProps(
//   input: Record<string, unknown>
// ): RequestSlipProps {
//   const result: RequestSlipProps = { purpose: 'Quick Slip' };

//   if (input.hasOwnProperty('author') && typeof input.author == 'string')
//     result.author = input.author;
//   if (input.hasOwnProperty('title') && typeof input.title == 'string')
//     result.title = input.title;
//   if (
//     input.hasOwnProperty('call_number') &&
//     typeof input.call_number == 'string'
//   )
//     result.callNumber = input.call_number;

//   if (
//     input.hasOwnProperty('publisher_const') &&
//     typeof input.publisher_const == 'string'
//   )
//     result.publisher = input.publisher_const;

//   if (input.hasOwnProperty('notes') && typeof input.notes == 'string')
//     result.notes = input.notes;

//   return result;
// }

interface PageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function QuickSlipHandler({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  //   console.log('PAGE resolvedParams:', resolvedParams);

  return (
    <>
      <ClientQuickPdf searchParams={resolvedParams} />
    </>
  );
}
