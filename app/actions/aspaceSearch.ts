/*
The entry point for all aspaceSearch functions is the searchByUrl function.
It is called by: searchBibs/page.tsx > RecordSearchForm > searchCatalogByAny@actions/catalogSearch
*/
'use server';
import {
  AspaceClient,
  repoResourcesSchema,
} from '@kenxirwin/archives-space-api-client';
import logger from '@/lib/logger';
import type { BibDataDraft, ItemDataDraft } from '@/lib/catalogs/types';
import { ZodError } from 'zod';
import { getRepoResources } from './aspace/handleRepoResources';
import { getTopContainers } from './aspace/handleTopContainers';
import { getArchivalObjectData } from './aspace/handleArchivalObjects';

export interface ArchivalObjectExtraInfo {
  numItems: number;
  numSeries: number;
  numSubseries: number;
  numSubGroups: number;
  subgroups?: any[];
  summaryInfo: string;
  firstItemUrl?: string;
  firstRecordArgusData?: { bibData: BibDataDraft; itemData: ItemDataDraft[] };
  items?: any[];
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
    if (url.startsWith(publicBaseUrl) && !url.startsWith(apiBaseUrl)) {
      url = url.replace(publicBaseUrl, apiBaseUrl);
    }
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
        return await getRepoResources(raw, url, publicUrl, client);
        break;
      }

      // https://archivesstaff.lib.miamioh.edu/api/repositories/2/top_containers/7838
      case /repositories\/\d+\/top_containers\/\d+/.test(url): {
        return await getTopContainers(raw, url, publicUrl, client);
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
