/* 
    This is a more complex approach to identifying items attached to 
    archival_objects in ArchivesSpace
*/

import { findNodeByKeyValuePair } from '@/lib/findNodeByKeyValuePair';
import { getResourceTree, searchByUrl } from './aspaceSearch';
import type {
  AspaceClient,
  RepoResources,
} from '@kenxirwin/archives-space-api-client';

export async function HandleMissingInstances(
  originalUri: string,
  parentResourceUrl: string,
  client: AspaceClient,
) {
  console.log(`looking for more info about ${parentResourceUrl}`);
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
  const numItems = node.children.length;
  console.log(numItems);
  if (numItems > 0) {
    const firstItemUrl =
      process.env.ASPACE_API_BASE_URL + node.children[0].record_uri;
    const firstRecordArgusData = await searchByUrl(firstItemUrl, client);
    console.log(`numItems: ${numItems}`);
    console.log(`first child = ${JSON.stringify(node.children[0])}`);
    const extraInfo = {
      numItems,
      firstItemUrl,
      firstRecordArgusData,
    };
    return extraInfo;
  } else {
    return {};
  }
}
