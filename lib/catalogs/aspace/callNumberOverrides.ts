import type {
  AspaceClient,
  RepoArchivalObject,
  RepoResources,
  RepoTopContainer,
} from '@kenxirwin/archives-space-api-client';
import { ArchivalObjectExtraInfo } from '@/app/actions/aspaceSearch';
import logger from '@/lib/logger';
import {
  getChildren,
  getExtraInfoFromNode,
} from '@/app/actions/aspace/handleMissingInstances';
import { getCallNumberFromInstance } from './getCallNumberFromInstance';

type ResourceInstance = RepoResources['instances'][number];
type ArchivalObjectInstance = RepoArchivalObject['instances'][number];

export interface AspaceCallNumberOverrides {
  resources?: {
    bib?: (
      data: RepoResources,
      client: AspaceClient,
    ) => string | Promise<string>;
    item?: (item: ResourceInstance, data: RepoResources) => string;
  };
  topContainer?: {
    bib?: (data: RepoTopContainer) => string | Promise<string>;
    item?: (data: RepoTopContainer) => string;
  };
  archivalObject?: {
    bib?: (
      data: RepoArchivalObject,
      client: AspaceClient,
      extraInfo?: ArchivalObjectExtraInfo,
    ) => string | Promise<string>;
    item?: (item: ArchivalObjectInstance, data: RepoArchivalObject) => string;
    allItems?: (data: RepoArchivalObject) => string[];
  };
}

/**
 * Designated extension point for institution-specific ArchivesSpace
 * call-number parsing. Ships with empty defaults, which preserves the
 * built-in parsing logic in app/actions/aspace/*.ts.
 *
 * To customize for your installation, edit this file directly and
 * implement whichever bib/item functions you need. See README.md for how
 * to set this file up so local edits don't conflict with upstream updates.
 */

const overrides: AspaceCallNumberOverrides = {
  resources: {
    // async bib(data: RepoResources, client: AspaceClient) {
    //   return `${data.id_0}--${data.id_1}--${data.id_2}`
    // },
  },
  archivalObject: {
    // async bib(data, client, extraInfo) {
    /* custom bib code */
    // },
    // item(itemData, data) {
    /* custom item code */
    // },
    // allItems(data): string[] {
    /* custom code for getting all items */
    // },
  },
};

export default overrides;
