import type {
  RepoArchivalObject,
  RepoResources,
  RepoTopContainer,
} from '@kenxirwin/archives-space-api-client';

type ResourceInstance = RepoResources['instances'][number];
type ArchivalObjectInstance = RepoArchivalObject['instances'][number];

const callRegexReg = /\d+(A|M)\-[A-Z]\-\d+[A-Z]/;
const callRegexWestern = /\[Range \d+[A-Z]\];* Box \d+/;

export interface AspaceCallNumberOverrides {
  resources?: {
    bib?: (data: RepoResources) => string;
    item?: (item: ResourceInstance, data: RepoResources) => string;
  };
  topContainer?: {
    bib?: (data: RepoTopContainer) => string;
    item?: (data: RepoTopContainer) => string;
  };
  archivalObject?: {
    bib?: (data: RepoArchivalObject) => string;
    item?: (item: ArchivalObjectInstance, data: RepoArchivalObject) => string;
  };
}

/**
 * Designated extension point for institution-specific ArchivesSpace
 * call-number parsing. Ships with empty defaults, which preserves the
 * built-in parsing logic in app/actions/aspaceSearch.ts.
 *
 * To customize for your installation, edit this file directly and
 * implement whichever bib/item functions you need. See README.md for how
 * to set this file up so local edits don't conflict with upstream updates.
 */
const overrides: AspaceCallNumberOverrides = {
  // resources: {
  //   bib(data) {
  //     return "return custom string";
  //   },
  // },
};

export default overrides;
