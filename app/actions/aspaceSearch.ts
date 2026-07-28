/*
The entry point for all aspaceSearch functions is the searchByUrl function.
It is called by: searchBibs/page.tsx > RecordSearchForm > searchCatalogByAny@actions/catalogSearch
*/
'use server';
import {
  AspaceClient,
  repoResourcesSchema,
  repoTopContainerSchema,
  repoArchivalObjectSchema,
} from '@kenxirwin/archives-space-api-client';
import logger from '@/lib/logger';
import callNumberOverrides from '@/lib/catalogs/aspace/callNumberOverrides';
import titleOverrides from '@/lib/catalogs/aspace/titleOverrides';
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
import { HandleMissingInstances } from './aspace/handleMissingInstances';
import { getRepoResources } from './aspace/handleRepoResources';
import { getArchivalObjectData } from './aspace/handleArchivalObjects';

export interface ArchivalObjectExtraInfo {
  numItems: number;
  sumSeries: number;
  numSubseries: number;
  summaryInfo: string;
  firstItemUrl: string;
  firstRecordArgusData: { bibData: BibDataDraft; itemData: ItemDataDraft };
  items: any[];
}

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

export async function getResourceTree(url: string, client: AspaceClient) {
  const publicBaseUrl = process.env.ASPACE_PUBLIC_BASE_URL ?? '';
  const apiBaseUrl = process.env.ASPACE_API_BASE_URL ?? '';
  url = url.replace(publicBaseUrl, apiBaseUrl);
  logger.verbose(`aspaceSearch/getResourceTree fetching: ${url}`);
  const raw = await client.getUrl(url, {
    resolve: ['tree'],
  });
  const parsed = repoResourcesSchema.parse(raw);
  return parsed;
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
    const publicUrl = url.replace(apiBaseUrl, publicBaseUrl);
    logger.verbose(`aspaceSearch/searchByUrl fetching: ${url}`);
    const raw = await client.getUrl(url, {
      resolve: ['linked_agents', 'repository', 'top_container'],
    });
    logger.silly(`Raw response: ${JSON.stringify(raw)}`);
    let extraInfo = {};
    switch (true) {
      // https://archivesstaff.lib.miamioh.edu/api/repositories/2/resources/634
      case /repositories\/\d+\/resources\/\d+/.test(url): {
        return await getRepoResources(raw, url, publicUrl);
        break;
      }

      // https://archivesstaff.lib.miamioh.edu/api/repositories/2/top_containers/7838
      case /repositories\/\d+\/top_containers\/\d+/.test(url): {
        logger.verbose('aspaceSearch.searchByUrl found topContainers');

        const parsed = repoTopContainerSchema.parse(raw);
        const argusData = repoTopContainerToDraft(parsed, publicUrl);
        logger.verbose(`ArgusData for repoTpContainer: ${argusData}`);
        logger.verbose('type: top containers');
        return argusData;
        break;
      }
      // https://archivesspace.lib.miamioh.edu/repositories/2/archival_objects/13405
      // https://archivesstaff.lib.miamioh.edu/api/repositories/2/archival_objects/13282
      // https://archivesstaff.lib.miamioh.edu/api/repositories/2/archival_objects/5616
      case /repositories\/\d+\/archival_objects\/\d+/.test(url): {
        return await getArchivalObjectData(raw, url, publicUrl, client);
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
 * repoTopContainerToDraft
 */
function repoTopContainerToDraft(data: RepoTopContainer, url: string) {
  const bibData: BibDataDraft = {
    author: 'Unknown',
    callNumber: callNumberOverrides.topContainer?.bib?.(data) ?? data.indicator,
    itemTitle: titleOverrides.topContainer?.(data) ?? data.long_display_string,
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
