'use server';
import {
  AspaceClient,
  repoResourcesSchema,
  repoTopContainerSchema,
  repoArchivalObjectSchema,
} from '@kenxirwin/archives-space-api-client';
import logger from '@/lib/logger';
import callNumberOverrides from '@/lib/catalogs/aspace/callNumberOverrides';
import type {
  RepoArchivalObject,
  RepoResources,
  RepoTopContainer,
} from '@kenxirwin/archives-space-api-client';
import type {
  BibDataDraft,
  ItemDataDraft,
  CatalogSearchResult,
} from '@/lib/catalogs/types';
import { ZodError } from 'zod';

export async function getClient() {
  try {
    const client = new AspaceClient({
      baseUrl: process.env.ASPACE_API_BASE_URL || '',
      username: process.env.ASPACE_API_USER || '',
      password: process.env.ASPACE_API_PASSWORD || '',
    });

    await client.getToken();
    return client;
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Aspace connection error: ${error.message}`);
      throw error;
    }
  }
  throw new Error(
    `Unknown error connecting to Aspace client in aspaceSearch.getClient()`,
  );
}

export async function bibHoldingsByUri({ uri }: { uri: string }) {
  const client = await getClient();
  const url = client.baseUrl + uri;
  return await searchByUrl(url, client);
}

export async function searchByUrl(url: string, client: AspaceClient) {
  /* expects a url matching one of these endpoints and schemas: 
(repoResourcesSchema): for endpoints like /repositories/2/resources/634
(repoTopContainerSchema): for endpoints like /repositories/2/top_containers/7838
(repoArchivalObjectSchema): for endpoints like /repositories/2/archival_objects/5616
*/
  try {
    const publicBaseUrl = process.env.ASPACE_PUBLIC_BASE_URL ?? '';
    const apiBaseUrl = process.env.ASPACE_API_BASE_URL ?? '';
    url = url.replace(publicBaseUrl, apiBaseUrl);
    logger.verbose(`aspaceSearch/searchByUrl fetching: ${url}`);
    const raw = await client.getUrl(url, {
      resolve: ['linked_agents', 'repository', 'top_container'],
    });
    switch (true) {
      // https://archivesstaff.lib.miamioh.edu/api/repositories/2/resources/634
      case /repositories\/\d+\/resources\/\d+/.test(url): {
        logger.verbose('aspaceSearch.searchByUrl found repoResources');
        const parsed = repoResourcesSchema.parse(raw);
        const argusData = repoResourcesToDraft(parsed, url);
        logger.verbose(JSON.stringify(argusData, null, 2));
        logger.verbose('type: resources');
        return argusData;
        break;
      }

      // https://archivesstaff.lib.miamioh.edu/api/repositories/2/top_containers/7838
      case /repositories\/\d+\/top_containers\/\d+/.test(url): {
        logger.verbose('aspaceSearch.searchByUrl found topContainers');

        const parsed = repoTopContainerSchema.parse(raw);
        const argusData = repoTopContainerToDraft(parsed, url);
        logger.verbose(`ArgusData for repoTpContainer: ${argusData}`);
        logger.verbose('type: top containers');
        return argusData;
        break;
      }
      // https://archivesspace.lib.miamioh.edu/repositories/2/archival_objects/13405
      // https://archivesstaff.lib.miamioh.edu/api/repositories/2/archival_objects/13282
      // https://archivesstaff.lib.miamioh.edu/api/repositories/2/archival_objects/5616
      case /repositories\/\d+\/archival_objects\/\d+/.test(url): {
        logger.verbose('aspaceSearch.searchByUrl found archivalObjects');

        const parsed = repoArchivalObjectSchema.parse(raw);
        const argusData = repoArchivalObjectToDraft(parsed, url);
        logger.verbose(argusData);
        logger.verbose('type: archival objects');
        return argusData;
        break;
      }

      default: {
        throw new Error(
          `Request URL did not match a known content type: ${url}`,
        );
      }
    }
  } catch (error) {
    if (error instanceof ZodError) {
      logger.error(`Zod parsing error: ${error.message}`);
      throw error;
    } else {
      error instanceof Error && logger.error(error.message);
      throw error;
    }
  }
}

/*
 * repoResourcesToDraft
 */

function repoResourcesToDraft(data: RepoResources, url: string) {
  const bibData: BibDataDraft = {
    author:
      data.linked_agents
        .filter((entry) => entry.role == 'creator')
        .map((entry) => entry._resolved?.names[0].sort_name)
        .join('; ') ?? 'Unknown',
    callNumber:
      callNumberOverrides.resources?.bib?.(data) ??
      `${data.id_0}--${data.id_1}--${data.id_2}`,
    itemTitle: data.title,
    catalog: 'ASPACE',
    catalogId: data.uri,
    catalogIdType: 'uri',
    location_codes: data.repository._resolved?.slug ?? '',
    location_display: data.repository._resolved?.name ?? '',
    notes: '',
    pub_date: null,
    publisher: null,
    totalItems: data.instances.length,
    url: url,
  };

  const itemData: ItemDataDraft[] = data.instances.map((item, index) => ({
    clientKey: `item-${index}`,
    barcode: '',
    box: '',
    call_number:
      callNumberOverrides.resources?.item?.(item, data) ??
      item.sub_container.top_container._resolved?.display_string ??
      '',
    copy_id: '',
    description: '',
    // item.sub_container.top_container._resolved?.long_display_string ?? '',
    folder: '',
    location_code: '', //data.repository._resolved?.slug ?? '',
    location_name: data.repository._resolved?.name ?? '',
    ms: '',
  }));

  return { bibData, itemData };
}

/*
 * repoTopContainerToDraft
 */
function repoTopContainerToDraft(data: RepoTopContainer, url: string) {
  const bibData: BibDataDraft = {
    author: 'Unknown',
    callNumber: callNumberOverrides.topContainer?.bib?.(data) ?? data.indicator,
    itemTitle: data.long_display_string,
    catalog: 'ASPACE',
    catalogId: data.uri,
    catalogIdType: 'uri',
    location_codes: data.repository._resolved?.slug ?? '',
    location_display: data.repository._resolved?.name ?? '',
    notes: '',
    pub_date: null,
    publisher: null,
    totalItems: 1,
    url: url,
  };

  const itemData: ItemDataDraft[] = [
    {
      clientKey: `item-0`,
      barcode: '',
      box: '',
      call_number:
        callNumberOverrides.topContainer?.item?.(data) ?? data.indicator,
      copy_id: '',
      description: data.indicator,
      folder: '',
      location_code: data.repository._resolved?.slug ?? '',
      location_name: data.repository._resolved?.name ?? '',
      ms: '',
    },
  ];

  return { bibData, itemData };
}

/*
 * repoArchivalObjectToDraft
 */

const getItems = (data: RepoArchivalObject) => {
  if (data.instances.length > 0) {
    return data.instances.map((item, index) => ({
      clientKey: `item-${index}`,
      barcode: '',
      box: '',
      call_number:
        callNumberOverrides.archivalObject?.item?.(item, data) ??
        item.sub_container.top_container._resolved?.display_string ??
        '',
      copy_id: '',
      description:
        item.sub_container.top_container._resolved?.long_display_string ?? '',
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

function repoArchivalObjectToDraft(data: RepoArchivalObject, url: string) {
  const bibData: BibDataDraft = {
    author:
      data.linked_agents
        .filter((entry) => entry.role == 'creator')
        .map((entry) => entry._resolved?.names[0].sort_name)
        .join('; ') ?? 'Unknown',
    callNumber:
      callNumberOverrides.archivalObject?.bib?.(data) ??
      data.instances
        .map(
          (instance) =>
            instance.sub_container.top_container._resolved?.indicator,
        )
        .join('; ') ??
      '',
    itemTitle: data.title,
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
