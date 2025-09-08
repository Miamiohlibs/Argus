import { bibHoldingsByAny } from '@/app/actions/almaSearch';
import entryAction from '@/app/actions/addEntry';
import EntryActionData from '@/types/EntryActionData';
import { NextResponse } from 'next/server';
import { CondensedBibHoldings } from '@/types/CondensedBibHoldings';
import { ItemEntry, BibEntry } from '@prisma/client';

export async function LookupAndAddSingleEntry(
  searchString: string,
  project_id: string
): Promise<{ query: string; message: string; status: 'success' | 'error' }> {
  // get holdings
  const result: { error?: string; data?: CondensedBibHoldings } =
    await bibHoldingsByAny(searchString);
  const { error, data } = result;

  if (error !== undefined) {
    return { status: 'error', query: searchString, message: error };
  }
  // if not error, prep data for database submission
  if (data !== undefined) {
    const itemData = createItemData(data);
    const bibData = createBibData({ holdings: data, project_id });
    if (bibData && itemData) {
      const entryData: EntryActionData = {
        bibData: bibData,
        itemData: itemData,
        actionType: 'add',
      };
      const databaseResponse: {
        error?: string;
        data?: { itemTitle: string; [key: string]: unknown };
      } = await entryAction(entryData);
      let finalMessage, finalStatus: 'success' | 'error';
      if (databaseResponse.error) {
        console.error(
          'Error adding entry to database:',
          databaseResponse.error
        );
        finalMessage = databaseResponse.error;
        finalStatus = 'error';
      } else {
        finalMessage =
          'Entry added successfully: ' +
          JSON.stringify(databaseResponse.data?.itemTitle);
        finalStatus = 'success';
      }
      return {
        status: finalStatus,
        query: searchString,
        message: finalMessage,
      };
    }
    return {
      status: 'error',
      query: searchString,
      message: 'Failed add entry to database (' + bibData.title + ')',
    };
  }
  return {
    status: 'error',
    query: searchString,
    message: 'Failed add entry to database',
  };
}

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
