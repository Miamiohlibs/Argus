import type {
  RepoArchivalObject,
  RepoResources,
  RepoTopContainer,
} from '@kenxirwin/archives-space-api-client';
import logger from '@/lib/logger';

export interface AspaceTitleOverrides {
  resources?: (data: RepoResources) => string;

  topContainer?: (data: RepoTopContainer) => string;

  archivalObject?: (data: RepoArchivalObject) => string;
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
  resources: (data: RepoResources): string => {
    return data.title;
  },

  topContainer: (data: RepoTopContainer): string => {
    logger.silly('****trying to replace title string');
    if (data.long_display_string) {
      return streamlineTitle(data.long_display_string);
    } else {
      return 'Title Unknown';
    }
  },

  archivalObject: (data: RepoArchivalObject): string => {
    return data.title;
  },
};

export default titleOverrides;
