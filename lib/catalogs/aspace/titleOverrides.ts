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

const titleOverrides: AspaceTitleOverrides = {
  // resources: (data: RepoResources): string => {
  //   return 'custom title here';
  // },
  // topContainer: (data: RepoTopContainer): string => {
  //   return 'custom title here';
  // },
  // archivalObject: (data: RepoArchivalObject): string => {
  //   return 'custom title here';
  // },
};

export default titleOverrides;
