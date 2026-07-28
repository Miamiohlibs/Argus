'use server';
import { repoResourcesSchema } from '@kenxirwin/archives-space-api-client';
import logger from '@/lib/logger';
import callNumberOverrides from '@/lib/catalogs/aspace/callNumberOverrides';
import titleOverrides from '@/lib/catalogs/aspace/titleOverrides';
import type { RepoResources } from '@kenxirwin/archives-space-api-client';
import type { BibDataDraft, ItemDataDraft } from '@/lib/catalogs/types';

export async function getRepoResources(
  raw: any,
  url: string,
  publicUrl: string,
) {
  logger.verbose('aspaceSearch.searchByUrl found repoResources');
  const parsed = repoResourcesSchema.parse(raw);
  const argusData = repoResourcesToDraft(parsed, publicUrl);
  logger.verbose(JSON.stringify(argusData, null, 2));
  logger.verbose('type: resources');
  return argusData;
}

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
    itemTitle: titleOverrides.resources?.(data) ?? data.title,
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
