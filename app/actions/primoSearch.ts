import { PrimoSearchResponse } from '@/types/PrimoSearchResponse';

//NEXT_PUBLIC_PRIMO_QUERYSTRING
//NEXT_PUBLIC_USE_PRIMO
//ALMA_BASE_URL
//path: /primo/v1/search

function verifyEnv() {
  if (
    !(
      process.env.ALMA_BASE_URL &&
      process.env.PRIMO_API_KEY &&
      process.env.PRIMO_QUERYSTRING
    )
  ) {
    throw new Error(
      'missing one or more .env settings: ALMA_BASE_URL, PRIMO_API_KEY, PRIMO_QUERYSTRING'
    );
  }
  return true;
}

async function ExecutePrimoQuery(query: string) {
  try {
    verifyEnv();
  } catch (error) {
    return { error };
  }
  try {
    let queryUrl =
      process.env.ALMA_BASE_URL +
      '/primo/v1/search?apikey=' +
      process.env.PRIMO_API_KEY +
      process.env.PRIMO_QUERYSTRING +
      '&q=' +
      query;
    const result = await fetch(queryUrl);
  } catch (error) {
    return { error };
  }
}

export async function getMmsIdByCallNumber({
  callNumber,
  precision,
}: {
  callNumber: string;
  precision: 'exact' | 'contains' | undefined | null;
}) {
  if (typeof precision != 'string') {
    precision = 'exact';
  }
  try {
    const response: PrimoSearchResponse = await ExecutePrimoQuery(
      `holding_call_number,${precision},${callNumber}`
    );
    const mms_ids = response.docs.map((doc) => doc.pnx.display?.mms);
    return mms_ids;
  } catch (error) {
    return { error };
  }
}
