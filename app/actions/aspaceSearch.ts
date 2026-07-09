'use server';
import {
  AspaceClient,
  repoResourcesSchema,
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
  switch (true) {
    // https://archivesstaff.lib.miamioh.edu/api/repositories/2/resources/634
    case /repositories\/\d+\/resources\/\d+/.test(url): {
      // case /repositories\//.test(url): {
      const response = await getRepoResources(url, client);
      console.log(response);
      break;
    }

    default: {
      throw new Error(`Request URL did not match a known content type: ${url}`);
    }
  }
}

async function getRepoResources(url: string, client: AspaceClient) {
  try {
    const raw = await client.getUrl(url);
    const parsed = repoResourcesSchema.parse(raw);
    return parsed;
  } catch (error) {
    error instanceof Error &&
      console.error(
        `error in aspaceSearch.getRepoResources(): ${error.message}`,
      );
    throw error;
  }
}
