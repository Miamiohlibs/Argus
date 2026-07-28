/* 
    This is a more complex approach to identifying items attached to 
    archival_objects in ArchivesSpace
*/

import { findNodeByKeyValuePair } from '@/lib/findNodeByKeyValuePair';
import { getResourceTree, searchByUrl } from '../aspaceSearch';
import type {
  AspaceClient,
  RepoResources,
} from '@kenxirwin/archives-space-api-client';
import { ArchivalObjectExtraInfo } from '@/app/actions/aspaceSearch';

import findChildren from '@/lib/findChildren';

export function SummarizeHoldings(extraInfo: any) {
  let summaryInfo = [];
  if (extraInfo.hasOwnProperty('numSeries') && extraInfo.numSeries > 0) {
    summaryInfo.push(`${extraInfo.numSeries} series`);
  }
  if (extraInfo.hasOwnProperty('numSubseries') && extraInfo.numSubseries > 0) {
    summaryInfo.push(`${extraInfo.numSubseries} subseries`);
  }
  if (extraInfo.hasOwnProperty('numItems') && extraInfo.numItems > 0) {
    summaryInfo.push(`${extraInfo.numItems} items`);
  }
  return summaryInfo.join('; ');
}
export async function HandleMissingInstances(
  originalUri: string,
  parentResourceUrl: string,
  client: AspaceClient,
) {
  console.log(
    `HandleMissingInstances(): looking for more info about ${parentResourceUrl}`,
  );
  const resourceWithTree: RepoResources = await getResourceTree(
    parentResourceUrl,
    client,
  );
  console.log(`Resource Title: ${resourceWithTree.title}`);
  console.log(
    `find key value pair in tree with record_uri: "${originalUri?.toString()}"`,
  );
  const node = findNodeByKeyValuePair(
    resourceWithTree,
    'record_uri',
    originalUri?.toString(), // not sure why toString is needed, but it is
  );
  const items = findChildren(
    {
      hasKeyValue: { key: 'level', value: 'item' },
      recursive: true,
    },
    node,
  );
  const numItems = items.length;
  const series = findChildren(
    {
      hasKeyValue: { key: 'level', value: 'series' },
      recursive: true,
    },
    node,
  );
  const numSeries = series.length;
  const subseries = findChildren(
    {
      hasKeyValue: { key: 'level', value: 'subseries' },
      recursive: true,
    },
    node,
  );
  const numSubseries = subseries.length;

  console.log(`numItems: ${numItems}`);
  if (numItems > 0) {
    const firstItemUrl =
      process.env.ASPACE_API_BASE_URL + node.children[0].record_uri;
    const firstRecordArgusData = await searchByUrl(firstItemUrl, client);
    console.log(`numItems: ${numItems}`);
    console.log(`first child = ${JSON.stringify(node.children[0])}`);
    const extraInfo = {
      numSeries,
      numSubseries,
      numItems,
      firstItemUrl,
      firstRecordArgusData,
      items,
      summaryInfo: '',
    };
    const summaryInfo = SummarizeHoldings(extraInfo);
    extraInfo.summaryInfo = summaryInfo;
    return extraInfo;
  } else {
    return {};
  }
}
