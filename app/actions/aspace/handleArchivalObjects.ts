'use server';
import {
  AspaceClient,
  repoArchivalObjectSchema,
} from '@kenxirwin/archives-space-api-client';
import logger from '@/lib/logger';
import callNumberOverrides from '@/lib/catalogs/aspace/callNumberOverrides';
import titleOverrides from '@/lib/catalogs/aspace/titleOverrides';
import type { RepoArchivalObject } from '@kenxirwin/archives-space-api-client';
import type {
  BibDataDraft,
  ItemDataDraft,
  CatalogSearchResult,
} from '@/lib/catalogs/types';
import { HandleMissingInstances } from './handleMissingInstances';

export async function getArchivalObjectData(
  raw: any,
  url: string,
  publicUrl: string,
  client: AspaceClient,
) {
  let extraInfo = {};
  logger.verbose('aspaceSearch.searchByUrl found archivalObjects');
  const parsed = repoArchivalObjectSchema.parse(raw);

  /* 
    If the archival object doesn't have any instances, try finding some 
    by searching down the tree of the main resource
    */
  if (parsed.instances.length == 0) {
    const parentResourceUrl = parsed.resource.ref;
    logger.verbose(`parentResourceUrl: ${parentResourceUrl}`);
    const originalUri = url.match(/\/repositories\/.*/);
    logger.verbose(`originalUri: ${originalUri}`);
    if (originalUri !== null) {
      extraInfo = await HandleMissingInstances(
        originalUri.toString(),
        parentResourceUrl,
        client,
      );
    }
  }

  let argusData;
  if (Object.keys(extraInfo).length > 0) {
    argusData = repoArchivalObjectToDraft(parsed, publicUrl, client, extraInfo);
  } else {
    argusData = repoArchivalObjectToDraft(parsed, publicUrl, client);
  }
  logger.verbose(argusData);
  logger.verbose('type: archival objects');
  return argusData;
}

async function repoArchivalObjectToDraft(
  data: RepoArchivalObject,
  url: string,
  client: AspaceClient,
  extraInfo?: any,
) {
  console.log(`EXTRA INFO: ${JSON.stringify(extraInfo)}`);
  const bibData: BibDataDraft = {
    author:
      data.linked_agents
        .filter((entry) => entry.role == 'creator')
        .map((entry) => entry._resolved?.names[0].sort_name)
        .join('; ') ?? 'Unknown',
    callNumber:
      (await callNumberOverrides.archivalObject?.bib?.(
        data,
        client,
        extraInfo,
      )) ??
      data.instances
        .map(
          (instance) =>
            instance.sub_container.top_container._resolved?.indicator,
        )
        .join('; ') ??
      '',
    itemTitle: titleOverrides.archivalObject?.(data) ?? data.title,
    catalog: 'ASPACE',
    catalogId: data.uri,
    catalogIdType: 'uri',
    location_codes: data.repository._resolved?.slug ?? '',
    location_display: data.repository._resolved?.name ?? '',
    notes: '',
    pub_date:
      (data.dates &&
        data.dates[0] &&
        (data.dates[0].begin || data.dates[0].end) &&
        `${data.dates[0]?.begin ?? ''} - ${data.dates[0]?.end ?? ''}`) ??
      '',
    publisher: null,
    totalItems: 1,
    url: url,
  };

  const itemData: ItemDataDraft[] = getItems(data) ?? [];

  return { bibData, itemData };
}

const getItems = (data: RepoArchivalObject) => {
  if (data.instances.length > 0) {
    return data.instances.map((item, index) => ({
      clientKey: `item-${index}`,
      barcode: '',
      box: '',
      call_number:
        callNumberOverrides.archivalObject?.item?.(item, data) ??
        item.sub_container?.top_container?._resolved?.display_string ??
        '',
      copy_id: '',
      description:
        item.sub_container?.top_container?._resolved?.long_display_string ?? '',
      folder: '',
      location_code: data.repository._resolved?.slug ?? '',
      location_name: data.repository._resolved?.name ?? '',
      ms: '',
    }));
  } else {
    if (callNumberOverrides.archivalObject?.allItems) {
      const callNumbers = callNumberOverrides.archivalObject?.allItems(data);
      return callNumbers.map((callNumber, index) => ({
        clientKey: `item-${index}`,
        barcode: '',
        box: '',
        call_number: callNumber ?? '',
        copy_id: '',
        description: '',
        folder: '',
        location_code: data.repository._resolved?.slug ?? '',
        location_name: data.repository._resolved?.name ?? '',
        ms: '',
      }));
    }
  }
};
