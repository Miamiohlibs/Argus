'use server';
import entryAction from '@/app/actions/addEntry';
import EntryActionData from '@/types/EntryActionData';
import { NextResponse } from 'next/server';
import { almaProvider } from '@/lib/catalogs/alma/provider';
import logger from '@/lib/logger';
import type { CatalogSearchResult } from '@/lib/catalogs/types';

export async function LookupAndAddSingleEntry(
  searchString: string,
  project_id: string,
  currentUserName: string,
  nonOwnerEditor: boolean,
): Promise<{ query: string; message: string; status: 'success' | 'error' }> {
  // get holdings
  const result: { error?: string; data?: CatalogSearchResult } =
    await almaProvider.searchByAny(searchString);
  const { error, data } = result;

  if (error !== undefined) {
    return { status: 'error', query: searchString, message: error };
  }
  // if not error, prep data for database submission
  if (data !== undefined) {
    const { bibData, itemData } = withNotes(
      data,
      currentUserName,
      nonOwnerEditor,
    );
    const entryData: EntryActionData = {
      bibData,
      itemData,
      projectId: parseInt(project_id, 10),
      actionType: 'add',
    };
    const databaseResponse: {
      error?: string;
      data?: { itemTitle: string; [key: string]: unknown };
    } = await entryAction(entryData);
    let finalMessage, finalStatus: 'success' | 'error';
    if (databaseResponse.error) {
      console.error('Error adding entry to database:', databaseResponse.error);
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
    message: 'Failed add entry to database',
  };
}

export default async function bulkAddEntries(
  searchStrings: string[],
  project_id: string,
  currentUserName: string,
  nonOwnerEditor: boolean,
): Promise<NextResponse> {
  // lookup holdings
  const holdings: Array<{
    data?: CatalogSearchResult;
    error?: string;
  }> = await Promise.all(
    searchStrings.map(async (item) => {
      const trimmedItem = item.trim();
      return await almaProvider.searchByAny(trimmedItem);
    }),
  );

  // format holdings to submit new entries
  const response: Array<CatalogSearchResult | undefined> = holdings.map(
    (holding) => {
      if (holding.data) {
        return withNotes(holding.data, currentUserName, nonOwnerEditor);
      }
      return undefined;
    },
  );
  logger.verbose('response', response);

  // submit entries
  const projectId = parseInt(project_id, 10);
  const finalResult = await Promise.all(
    response.map(async (res) => {
      if (res) {
        const entryData: EntryActionData = {
          bibData: res.bibData,
          itemData: res.itemData,
          projectId,
          actionType: 'add',
        };
        return await entryAction(entryData);
      }
    }),
  );

  return NextResponse.json({ response, finalResult });
}

function withNotes(
  result: CatalogSearchResult,
  currentUserName: string,
  nonOwnerEditor: boolean,
): CatalogSearchResult {
  return {
    ...result,
    bibData: {
      ...result.bibData,
      notes: nonOwnerEditor ? `added by ${currentUserName} as admin` : '',
    },
  };
}
