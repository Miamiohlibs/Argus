import logger from '@/lib/logger';
import { PrimoSearchResponse } from '@/types/PrimoSearchResponse';

function verifyEnv() {
  if (
    !(
      process.env.ALMA_BASEURL &&
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

async function ExecutePrimoQuery(
  query: string
): Promise<{ result?: PrimoSearchResponse; error?: string }> {
  try {
    verifyEnv();
  } catch (error) {
    return { error: error as string };
  }
  try {
    let queryUrl =
      process.env.ALMA_BASEURL +
      '/primo/v1/search?apikey=' +
      process.env.PRIMO_API_KEY +
      '&' +
      process.env.PRIMO_QUERYSTRING +
      '&q=' +
      query;
    logger.debug({ callingUrl: queryUrl });
    const response = await fetch(queryUrl);
    const data = await response.json();
    return { result: data };
  } catch (error) {
    logger.error({ error: `Error in ExecutePrimoQuery(${query}): ${error}` });
    return { error: `Error in ExecutePrimoQuery(${query}): ${error}` };
  }
}

export async function getMmsIdByCallNumber({
  callNumber,
  precision,
}: {
  callNumber: string;
  precision?: 'exact' | 'contains' | undefined | null;
}) {
  if (typeof precision != 'string') {
    precision = 'exact';
  }
  try {
    const { result, error }: { result?: PrimoSearchResponse; error?: string } =
      await ExecutePrimoQuery(`holding_call_number,${precision},${callNumber}`);
    if (error) {
      return { error: 'error received at getMmsIdByCallNumber: ' + error };
    }
    const mms_ids = result
      ? result.docs.map((doc) => doc.pnx.display?.mms)
      : [];
    return mms_ids;
  } catch (error) {
    logger.error({
      error: `Error in getMmsIdByCallNumber(${callNumber}): ${error}`,
    });
    return { error: 'caught error in getMmsIdByCallNumber: ' + error };
  }
}
