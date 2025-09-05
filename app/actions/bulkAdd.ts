import { bibHoldingsByAny } from '@/app/actions/almaSearch';
import entryAction from '@/app/actions/addEntry';
import EntryActionData from '@/types/EntryActionData';
import { NextResponse } from 'next/server';
import { CondensedBibHoldings } from '@/types/CondensedBibHoldings';
import { ItemEntry, BibEntry } from '@prisma/client';

export default async function bulkAddEntries(
  searchStrings: string[],
  project_id: string
): Promise<NextResponse> {
  //lookup holdings
  const holdings: Array<{
    data?: CondensedBibHoldings;
    error?: string;
  }> = await Promise.all(
    searchStrings.map(async (item) => {
      const trimmedItem = item.trim();
      return await bibHoldingsByAny(trimmedItem);
    })
  );

  // format holdings to submit new entries
  const response = holdings.map((holding) => {
    if (holding.data) {
      const itemData = createItemData(holding.data);
      const bibData = createBibData({ holdings: holding.data, project_id });
      return { itemData, bibData };
    }
    return {};
  });
  console.log('response', response);

  // submit entries
  const finalResult = await Promise.all(
    response.map(async (res) => {
      if (res.bibData && res.itemData) {
        const entryData: EntryActionData = {
          bibData: res.bibData,
          itemData: res.itemData,
          actionType: 'add',
        };
        return await entryAction(entryData);
      }
    })
  );

  return NextResponse.json({ response, finalResult });
}

function createBibData({
  holdings,
  project_id,
}: {
  holdings: CondensedBibHoldings;
  project_id: string;
}): Record<string, FormDataEntryValue> {
  const bibData: Record<string, FormDataEntryValue> = {
    project_id: project_id,
    title: holdings.bib_data.title,
    author: holdings.bib_data.author,
    publisher: holdings.bib_data.publisher_const,
    year: holdings.bib_data.date_of_publication,
    mms_id: holdings.bib_data.mms_id,
    location: holdings.items.map((item) => item.location.desc).join(','),
    location_codes: holdings.items.map((item) => item.location.value).join(','),
    location_names: holdings.items.map((item) => item.location.desc).join(','),
  };
  return bibData;
}

function createItemData(holdings: CondensedBibHoldings): ItemEntry[] {
  return holdings.items.map((item) => ({
    call_number: item.call_number,
    location: item.location.desc,
    location_code: item.location.value,
    location_name: item.location.desc,
    barcode: item.barcode,
    copy_id: null,
    box: null,
    folder: null,
    ms: null,
    description: null,
    bibEntryId: null,
    id: 'unknown',
  }));
}
