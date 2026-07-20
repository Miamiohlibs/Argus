import type {
  RepoArchivalObject,
  RepoResources,
  RepoTopContainer,
} from '@kenxirwin/archives-space-api-client';
import { ArchivalObjectExtraInfo } from '@/app/actions/aspaceSearch';

// type ResourceInstance = RepoResources['instances'][number];
// type ArchivalObjectInstance = RepoArchivalObject['instances'][number];

export interface AspaceTitleOverrides {
  resources?: {
    bib?: (data: RepoResources) => string;
    // item?: (item: ResourceInstance, data: RepoResources) => string;
  };
  topContainer?: (data: RepoTopContainer) => string;
  //   {
  //     bib?:
  //     // item?: (data: RepoTopContainer) => string;
  //   };
  archivalObject?: {
    bib?: (
      data: RepoArchivalObject,
      extraInfo?: ArchivalObjectExtraInfo,
    ) => string;
    // item?: (item: ArchivalObjectInstance, data: RepoArchivalObject) => string;
    // allItems?: (data: RepoArchivalObject) => string[];
  };
}

/**
 * Designated extension point for institution-specific ArchivesSpace
 * title parsing. Ships with empty defaults, which preserves the
 * built-in parsing logic in app/actions/aspaceSearch.ts.
 *
 * To customize for your installation, edit this file directly and
 * implement whichever bib/item functions you need. See README.md for how
 * to set this file up so local edits don't conflict with upstream updates.
 */

const streamlineTitle = (input: string): string => {
  const one = input.replace(
    /King Library *,* *3rd Floor *,* *Walter Havighurst *,* *Special Collections and Archives/,
    '',
  );
  return one;
};

const titleOverrides: AspaceTitleOverrides = {
  resources: {},

  topContainer: (data: RepoTopContainer): string => {
    console.log('****trying to replace title string');
    if (data.long_display_string) {
      return streamlineTitle(data.long_display_string);
    } else {
      return '';
    }
  },
  //   },

  archivalObject: {},
};

export default titleOverrides;
