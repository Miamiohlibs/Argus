/* 
    This is a more complex approach to identifying items attached to 
    archival_objects in ArchivesSpace
*/
import logger from '@/lib/logger';
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
  if (extraInfo.hasOwnProperty('numSubGroups') && extraInfo.numSubGroups > 0) {
    summaryInfo.push(`${extraInfo.numSubGroups} subgroups`);
  }
  return summaryInfo.join('; ');
}

export function getChildren(node: any) {
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
  const subgroups = findChildren(
    {
      hasKeyValue: { key: 'level', value: 'subgrp' },
      recursive: true,
    },
    node,
  );
  const numSubGroups = subgroups.length;
  return {
    items,
    numItems,
    series,
    numSeries,
    subseries,
    numSubseries,
    subgroups,
    numSubGroups,
  };
}

export async function HandleMissingInstances(
  originalUri: string,
  parentResourceUrl: string,
  client: AspaceClient,
) {
  logger.debug(
    `HandleMissingInstances(): looking for more info about ${parentResourceUrl}`,
  );
  const resourceWithTree: RepoResources = await getResourceTree(
    parentResourceUrl,
    client,
  );
  logger.debug(`Resource Title: ${resourceWithTree.title}`);
  logger.debug(
    `find key value pair in tree with record_uri: "${originalUri?.toString()}"`,
  );
  const node = findNodeByKeyValuePair(
    resourceWithTree,
    'record_uri',
    originalUri?.toString(), // not sure why toString is needed, but it is
  );
  return await getExtraInfoFromNode(node, client);
}

export async function getExtraInfoFromNode(
  node: any,
  client: AspaceClient,
): Promise<ArchivalObjectExtraInfo> {
  const {
    items,
    numItems,
    series,
    numSeries,
    subseries,
    numSubseries,
    subgroups,
    numSubGroups,
  } = getChildren(node);

  logger.debug(`numItems: ${numItems}`);
  if (numItems > 0 || numSubGroups > 0) {
    let firstItemUrl;
    if (numItems > 0) {
      firstItemUrl = process.env.ASPACE_API_BASE_URL + items[0].record_uri;
    } else {
      firstItemUrl = process.env.ASPACE_API_BASE_URL + subgroups[0].record_uri;
    }
    // const firstItemUrl = process.env.ASPACE_API_BASE_URL + items[0].record_uri;
    const firstRecordArgusData = await searchByUrl(firstItemUrl, client);
    // console.log(`first child = ${JSON.stringify(node.children[0])}`);
    const extraInfo = {
      numSeries,
      numSubseries,
      numItems,
      numSubGroups,
      firstItemUrl,
      firstRecordArgusData,
      items,
      subgroups,
      summaryInfo: '',
    };
    const summaryInfo = SummarizeHoldings(extraInfo);
    extraInfo.summaryInfo = summaryInfo;
    return extraInfo;
  } else {
    const extraInfo = {
      numSeries,
      numSubseries,
      numItems,
      numSubGroups,
      subgroups,
      summaryInfo: '',
    };
    extraInfo.summaryInfo = SummarizeHoldings(extraInfo);
    return extraInfo;
  }
}
