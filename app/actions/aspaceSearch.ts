'use server';
import {
  AspaceClient,
  repoResourcesSchema,
  repoTopContainerSchema,
  repoArchivalObjectSchema,
} from '@kenxirwin/archives-space-api-client';
import type {
  RepoResources,
  RepoTopContainer,
} from '@kenxirwin/archives-space-api-client';
import type {
  BibDataDraft,
  ItemDataDraft,
  CatalogSearchResult,
} from '@/lib/catalogs/types';

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
      console.error(`Aspace connection error: ${error.message}`);
      throw error;
    }
  }
  throw new Error(
    `Unknown error connecting to Aspace client in aspaceSearch.getClient()`,
  );
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
    console.log(`fetching url: ${url}`);
    const raw = await client.getUrl(url, {
      resolve: ['linked_agents', 'repository', 'top_container'],
    });
    switch (true) {
      // https://archivesstaff.lib.miamioh.edu/api/repositories/2/resources/634
      case /repositories\/\d+\/resources\/\d+/.test(url): {
        const parsed = repoResourcesSchema.parse(raw);
        const argusData = repoResourcesToDraft(parsed);
        // console.log(JSON.stringify(argusData, null, 2));
        // console.log('type: resources');
        return argusData;
        break;
      }

      // https://archivesstaff.lib.miamioh.edu/api/repositories/2/top_containers/7838
      case /repositories\/\d+\/top_containers\/\d+/.test(url): {
        const parsed = repoTopContainerSchema.parse(raw);
        const argusData = repoTopContainerToDraft(parsed);
        console.log(`ArgusData for repoTpContainer: ${argusData}`);
        console.log('type: top containers');
        return argusData;
        break;
      }

      // https://archivesstaff.lib.miamioh.edu/api/repositories/2/archival_objects/5616
      case /repositories\/\d+\/archival_objects\/\d+/.test(url): {
        const parsed = repoArchivalObjectSchema.parse(raw);
        console.log(parsed);
        console.log('type: archival objects');
        break;
      }

      default: {
        throw new Error(
          `Request URL did not match a known content type: ${url}`,
        );
      }
    }
  } catch (error) {
    error instanceof Error && console.error(error.message);
    throw error;
  }
}

function repoResourcesToDraft(data: RepoResources) {
  const bibData: BibDataDraft = {
    author:
      data.linked_agents
        .filter((entry) => entry.role == 'creator')
        .map((entry) => entry._resolved?.names[0].sort_name)
        .join('; ') ?? 'Unknown',
    callNumber: `${data.id_0}--${data.id_1}--${data.id_2}`,
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
    url: data.uri,
  };

  const itemData: ItemDataDraft[] = data.instances.map((item, index) => ({
    clientKey: `item-${index}`,
    barcode: '',
    box: '',
    call_number:
      item.sub_container.top_container._resolved?.display_string ?? '',
    copy_id: '',
    description:
      item.sub_container.top_container._resolved?.long_display_string ?? '',
    folder: '',
    location_code: data.repository._resolved?.slug ?? '',
    location_name: data.repository._resolved?.name ?? '',
    ms: '',
  }));

  return { bibData, itemData };
}
function repoTopContainerToDraft(data: RepoTopContainer) {
  const bibData: BibDataDraft = {
    author: 'Unknown',
    callNumber: data.indicator,
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
    url: data.uri,
  };

  const itemData: ItemDataDraft[] = [
    {
      clientKey: `item-0`,
      barcode: '',
      box: '',
      call_number: data.indicator,
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
