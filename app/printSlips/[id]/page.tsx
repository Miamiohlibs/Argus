import type { Prisma } from '@prisma/client';
import SlipsList from '@/components/SlipsList';

// Type for a single entry with its items
type EntryWithItems = Prisma.BibEntryGetPayload<{
  include: { items: true };
}>;

// Type for the result we want to return
type EntriesResult = {
  entries: EntryWithItems[];
  totalCount: number;
};

const printSlips = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;

  return (
    <>
      <SlipsList id={id} />
    </>
  );
};

export default printSlips;
