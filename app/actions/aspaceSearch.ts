'use server';
import {
  AspaceClient,
  repoResourcesSchema,
  repoTopContainerSchema,
  repoArchivalObjectSchema,
} from '@kenxirwin/archives-space-api-client';
import type { RepoResources } from '@kenxirwin/archives-space-api-client';

export async function getClient() {
  try {
    const client = new AspaceClient({
      baseUrl: process.env.ASPACE_BASE_URL || '',
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
    const raw = await client.getUrl(url);
    switch (true) {
      // https://archivesstaff.lib.miamioh.edu/api/repositories/2/resources/634
      case /repositories\/\d+\/resources\/\d+/.test(url): {
        const parsed = repoResourcesSchema.parse(raw);
        console.log(parsed);
        console.log('type: resources');
        break;
      }

      // https://archivesstaff.lib.miamioh.edu/api/repositories/2/top_containers/7838
      case /repositories\/\d+\/top_containers\/\d+/.test(url): {
        const parsed = repoTopContainerSchema.parse(raw);
        console.log(parsed);
        console.log('type: top containers');
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
