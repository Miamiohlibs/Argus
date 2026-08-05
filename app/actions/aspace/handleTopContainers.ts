'use server';
import { repoTopContainerSchema } from '@kenxirwin/archives-space-api-client';
import logger from '@/lib/logger';
import callNumberOverrides from '@/lib/catalogs/aspace/callNumberOverrides';
import titleOverrides from '@/lib/catalogs/aspace/titleOverrides';
import type {
  AspaceClient,
  RepoTopContainer,
} from '@kenxirwin/archives-space-api-client';
import type { BibDataDraft, ItemDataDraft } from '@/lib/catalogs/types';
import { z } from 'zod';

const aspaceSolrResultSchema = z.object({
  uri: z.string(),
  title: z.string(),
  primary_type: z.string(),
  level: z.string(),
  json: z.string(),
});
const aspaceSolrResultPaginationSchema = z.object({
  page_size: z.number(),
  first_page: z.number(),
  last_page: z.number(),
  this_page: z.number(),
  offset_first: z.number(),
  offset_last: z.number(),
  total_hits: z.number(),
  results: z.array(aspaceSolrResultSchema),
});
type AspaceSolrResultPaginationSchema = z.infer<
  typeof aspaceSolrResultPaginationSchema
>;

type SolrItem = {
  title: string;
  callNumber: string;
};

export async function getTopContainers(
  raw: any,
  url: string,
  publicUrl: string,
  client: AspaceClient,
) {
  logger.verbose('aspaceSearch.searchByUrl found topContainers');
  const matches = url.match(/repositories\/(\d+)\/top_containers\/(\d+)/);
  let solrItems: SolrItem[] = [];
  if (matches !== null) {
    const repoId = matches[1];
    const topContainerId = matches[2];
    // logger.debug(`topContainerId: ${topContainerId}`);
    const moreUri = `/repositories/${repoId}/search?q=top_container_uri_u_sstr:"/repositories/${repoId}/top_containers/${topContainerId}"&type[]=archival_object&type[]=resource&type[]=accession&page=1&page_size=250&fields[]=uri&fields[]=title&fields[]=level&fields[]=primary_type&fields[]=json`;
    logger.debug(`fetch Solr topContainer info: ${moreUri}`);
    const moreRaw = await client.getUrl(moreUri);
    // logger.debug(`moreInfo response: ${JSON.stringify(moreRaw)}`);
    const moreParsed = aspaceSolrResultPaginationSchema.parse(moreRaw);
    // logger.debug(JSON.stringify(moreParsed, null, 2));
    solrItems = getContainerItems(moreParsed) ?? [];
  }
  const parsed = repoTopContainerSchema.parse(raw);
  logger.verbose(`solrItems length: ${solrItems.length}`);
  const argusData = await repoTopContainerToDraft(parsed, publicUrl, solrItems);
  logger.debug(`ArgusData for repoTopContainer: ${JSON.stringify(argusData)}`);
  logger.verbose('type: top containers');
  return argusData;
}

function getContainerItems(data: AspaceSolrResultPaginationSchema) {
  const itemDataOnly = data.results.filter((entry) => entry.level == 'item');
  const items = itemDataOnly.map((item) => {
    const title = item.title,
      itemData = JSON.parse(item.json);
    let callNumber;
    const type_2 = itemData.instances[0].sub_container?.type_2 as string;
    const indicator_2 =
      itemData.instances[0].sub_container?.indicator_2 ?? null;
    const type = itemData.instances[0].sub_container?.top_container?._resolved
      ?.type as string;
    const indicator =
      itemData.instances[0].sub_container?.top_container?._resolved
        ?.indicator ?? null;
    if (type && indicator && indicator_2) {
      const capitalType = type.charAt(0).toUpperCase() + type.slice(1);
      const capitalType2 = type_2.charAt(0).toUpperCase() + type_2.slice(1);
      callNumber = `${capitalType} ${indicator}`;
      if (type_2 && indicator_2) {
        const capitalType2 = type_2.charAt(0).toUpperCase() + type_2.slice(1);
        callNumber += `, ${capitalType2} ${indicator_2}`;
      }
    } else {
      callNumber =
        itemData.instances[0].sub_container?.top_container?._resolved
          ?.display_string ??
        itemData.instances[0].sub_container?.top_container?._resolved.indicator;
    }
    logger.debug(`TopContainer ITEM: ${title}, ${callNumber}`);
    // logger.verbose(`OBJECT: ${JSON.stringify(itemData, null, 2)}`);
    return { title, callNumber };
  });
  return items;
}

async function repoTopContainerToDraft(
  data: RepoTopContainer,
  url: string,
  solrItems: SolrItem[],
) {
  const bibData: BibDataDraft = {
    author: 'Unknown',
    callNumber:
      (await callNumberOverrides.topContainer?.bib?.(data)) ?? data.indicator,
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

  let itemData: ItemDataDraft[] = [];

  if (solrItems.length > 0) {
    itemData = solrItems.map((item, i) => {
      return {
        clientKey: `item-${i}`,
        barcode: '',
        box: '',
        call_number: item.callNumber,
        copy_id: '',
        description: item.title,
        folder: '',
        location_code: '',
        location_name: data.repository._resolved?.name ?? '',
        ms: '',
      };
    });
  } else {
    itemData = [
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
  }
  return { bibData, itemData };
}
