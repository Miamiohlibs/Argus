// import { getMmsIdByCallNumber } from '@/app/actions/primoSearch';
import { bibHoldingsByAny } from '@/app/actions/almaSearch';
import entryAction from '@/app/actions/addEntry';
import EntryActionData from '@/types/EntryActionData';
import { NextResponse } from 'next/server';
import { CondensedBibHoldings } from '@/types/CondensedBibHoldings';
import { ItemEntry, BibEntry } from '@prisma/client';

// const entryAction = async ({
//   bibData,
//   itemData,
//   actionType,
//   existingEntryId,
// }: EntryActionData)

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
    location_codes: holdings.items.map((item) => item.location.value).join(','),
    location_names: holdings.items.map((item) => item.location.desc).join(','),
  };
  return bibData;
}

function createItemData(holdings: CondensedBibHoldings): ItemEntry[] {
  return holdings.items.map((item) => ({
    call_number: item.call_number,
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

export async function GET() {
  const project_id = '49'; // temp hardcode
  const arr = [
    '991000014819708518', //Flosculi
    // 'Z250.3 .F58 1967', // Flosculi
    // 'PS3552.R4825 E27 1990', // Earth
    '991017357419708518', // Earth
    '991000024539708518', // Orwell -- no item info to pass
  ];
  const holdings: Array<{
    data?: CondensedBibHoldings;
    error?: string;
  }> = await Promise.all(
    arr.map(async (item) => {
      return await bibHoldingsByAny(item);
    })
  );
  const response = holdings.map((holding) => {
    if (holding.data) {
      const itemData = createItemData(holding.data);
      const bibData = createBibData({ holdings: holding.data, project_id });
      return { itemData, bibData };
    }
    return {};
  });
  console.log('response', response);
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
