'use server';
import { repoTopContainerSchema } from '@kenxirwin/archives-space-api-client';
import logger from '@/lib/logger';
import callNumberOverrides from '@/lib/catalogs/aspace/callNumberOverrides';
import titleOverrides from '@/lib/catalogs/aspace/titleOverrides';
import type { RepoTopContainer } from '@kenxirwin/archives-space-api-client';
import type { BibDataDraft, ItemDataDraft } from '@/lib/catalogs/types';

export async function getTopContainers(
  raw: any,
  url: string,
  publicUrl: string,
) {
  logger.verbose('aspaceSearch.searchByUrl found topContainers');
  const parsed = repoTopContainerSchema.parse(raw);
  const argusData = repoTopContainerToDraft(parsed, publicUrl);
  logger.verbose(`ArgusData for repoTpContainer: ${argusData}`);
  logger.verbose('type: top containers');
  return argusData;
}

async function repoTopContainerToDraft(data: RepoTopContainer, url: string) {
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
