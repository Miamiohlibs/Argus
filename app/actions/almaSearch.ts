// import 'dotenv/config';
'use server';
import { SearchBibs } from '@kenxirwin/alma-search';
import { getMmsIdByCallNumber } from './primoSearch';
import type {
  AlmaItem,
  AlmaItemApiResponse,
  // AlmaItemHoldingItemData,
} from '@/types/AlmaItem';
import type {
  CondensedBibHoldings,
  AlmaItemDataPlusHoldingDetails,
} from '@/types/CondensedBibHoldings';
import logger from '@/lib/logger';

export async function lookupAny(input: string) {
  const INST_CODE = process.env.NEXT_PUBLIC_INST_CODE
    ? process.env.NEXT_PUBLIC_INST_CODE
    : '';
  const BARCODE_PREFIX = process.env.NEXT_PUBLIC_BARCODE_PREFIX
    ? process.env.NEXT_PUBLIC_BARCODE_PREFIX
    : '';
  const urlRe = /^https?\:\/\//;
  const almaMmsRe = new RegExp('alma(99\\d+' + INST_CODE.toString() + ')$');
  const mmsRe = new RegExp('^(99\\d+' + INST_CODE.toString() + ')$');
  const barcodeRe = new RegExp('(^' + BARCODE_PREFIX.toString() + '\\d+)$');
  const callRe = /^[A-Z]{1,3}\s*[0-9]{1,4}(\.[0-9]+)?\s*/;

  if (input.match(urlRe)) {
    let found = input.match(almaMmsRe);
    if (Array.isArray(found)) {
      return await bibHoldings({ mms_id: found[1] });
    } else {
      console.log(
        `No MMS_ID found in url: ${input}. Hint: Permalink URLs will only work here if they end in ...alma99 followed by a bunch of digits. If you have a different sort of permalink, try looking up by Barcode or Call Number.`
      );
    }
  } else if (input.match(mmsRe)) {
    return await bibHoldings({ mms_id: input });
  } else if (input.match(barcodeRe)) {
    return await bibHoldingsByBarcode({ barcode: input });
  } else if (input.match(callRe)) {
    return await bibHoldingsByCallNumber({ call_number: input });
  } else {
    return {
      error: `Could not identify item based on Permalink URL, MMS_ID, Barcode or Call Number: ${input}`,
    };
  }
}

export async function findByBarcode(barcode: string): Promise<AlmaItem> {
  try {
    const alma = new SearchBibs({
      baseUrl: process.env.ALMA_BASEURL || '',
      apiKey: process.env.ALMA_API_KEY || '',
    });
    const results: AlmaItem = await alma.barcodeLookup(barcode);
    logger.verbose('Search results by barcode:', results);
    return results;
  } catch (error) {
    logger.error('Error searching by barcode:', error);
    throw error;
  }
}

export async function bibById({ mms_id }: { mms_id: string }) {
  try {
    const alma = new SearchBibs({
      baseUrl: process.env.ALMA_BASEURL || '',
      apiKey: process.env.ALMA_API_KEY || '',
    });

    const results = await alma.idLookup({ mms_id });
    logger.verbose('Search results by ID:', results);
    return { data: results };
  } catch (error) {
    logger.error('Error searching by ID:', error);
    return { error: 'Lookup failed with message:' + `: ${error}` };
  }
}

// paginate through all API results
async function getAllHoldingsItemsByMmsId(
  mms_id: string,
  limit = 100
): Promise<AlmaItemApiResponse> {
  let allItems: AlmaItem[] = [];
  let offset = 0;
  let totalCount = 0;
  const alma = new SearchBibs({
    baseUrl: process.env.ALMA_BASEURL || '',
    apiKey: process.env.ALMA_API_KEY || '',
  });

  while (true) {
    const results: AlmaItemApiResponse = await alma.holdingsItemsByMmsId(
      mms_id,
      { offset, limit }
    );

    if (offset === 0) {
      totalCount = results.total_record_count;
    }

    allItems = allItems.concat(results.item);

    if (allItems.length >= totalCount) {
      break;
    }

    offset += limit;
  }

  return {
    total_record_count: allItems.length,
    item: allItems,
  };
}

function condenseBibHoldings(response: AlmaItemApiResponse) {
  const uniqHoldings = [
    ...new Set(response.item.map((item) => item.holding_data.holding_id)),
  ];
  const allCallNumbersArr = [
    ...new Set(response.item.map((item) => item.holding_data.call_number)),
  ];
  const allCallNumbers: string = allCallNumbersArr.join(',');
  //  response.item[0].bib_data.
  const allLocationsArr = [
    ...new Set(response.item.map((item) => item.item_data.location.value)),
  ];
  const allLocations = allLocationsArr.join(',');
  // logger.verbose(uniqBibHoldings);
  const output: CondensedBibHoldings = {
    bib_data: response.item[0].bib_data,
    items: [],
    locationCodes: '',
  };
  output.bib_data.call_number = allCallNumbers;
  output.bib_data.location = allLocations;

  uniqHoldings.forEach((holdingId) => {
    const allMatchingHoldings: AlmaItem[] = response.item.filter(
      (item) => item.holding_data.holding_id == holdingId
    );
    const allMatchingItems: AlmaItemDataPlusHoldingDetails[] =
      allMatchingHoldings.map((holding) => ({
        ...holding.item_data,
        copy_id: holding.holding_data.copy_id,
        holding_id: holding.holding_data.holding_id,
        call_number: holding.holding_data.call_number,
      }));
    // valuable info from holding:
    // - copy_id, holding_id, call_number
    // const bib_data = allMatchingHoldings[0].bib_data;
    // const locationCodes = [
    //   ...new Set(response.item.map((item) => item.item_data.location.value)),
    // ].join(',');

    output.items.push(...allMatchingItems);
  });
  return output;
}

export async function bibHoldings({ mms_id }: { mms_id: string }) {
  try {
    const results: AlmaItemApiResponse = await getAllHoldingsItemsByMmsId(
      mms_id
    );

    const condensedResults = condenseBibHoldings(results);
    if (condensedResults !== undefined) {
      return { data: condensedResults };
    }
    return { error: 'Error fetching holdings' };
  } catch (error) {
    logger.error('Error fetching holdings:', error);
    return { error: 'Holdings lookup failed with message:' + `: ${error}` };
  }
}

export async function bibHoldingsByBarcode({ barcode }: { barcode: string }) {
  try {
    const results: AlmaItem = await findByBarcode(barcode);
    const wrapped: AlmaItemApiResponse = {
      total_record_count: 1,
      item: [results],
    };
    const condensedResults = condenseBibHoldings(wrapped);
    if (condensedResults !== undefined) {
      return { data: condensedResults };
    }
    return { error: 'Error fetching holdings' };
  } catch (error) {
    logger.error('Error fetching holdings:', error);
    return { error: 'Holdings lookup failed with message:' + `: ${error}` };
  }
}

export async function bibHoldingsByCallNumber({
  call_number,
}: {
  call_number: string;
}) {
  try {
    const mms_ids = await getMmsIdByCallNumber({ callNumber: call_number });
    if (mms_ids === undefined) {
      const errString = `No results found for call number ${call_number}`;
      console.error(errString);
      return { error: errString };
    }
    if (
      mms_ids &&
      mms_ids != undefined &&
      Array.isArray(mms_ids) &&
      mms_ids.length == 1
    ) {
      const mms_id: string = typeof mms_ids[0] == 'string' ? mms_ids[0] : '';
      const { data, error } = await bibHoldings({ mms_id });
      if (error) {
        throw new Error(error);
      }
      return { data };
    } else {
      throw new Error(`invalid search results`);
    }
  } catch (error) {
    const errString = `Error finding bib record from call number ${call_number}: ${error}`;
    logger.error(errString);
    return { error: errString };
  }
}
