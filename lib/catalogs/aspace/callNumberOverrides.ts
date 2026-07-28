import type {
  RepoArchivalObject,
  RepoResources,
  RepoTopContainer,
} from '@kenxirwin/archives-space-api-client';
import { ArchivalObjectExtraInfo } from '@/app/actions/aspaceSearch';
import logger from '@/lib/logger';

type ResourceInstance = RepoResources['instances'][number];
type ArchivalObjectInstance = RepoArchivalObject['instances'][number];

const callRegexMost = /\[*\d+(A|M)\-[A-Z]\-\d+[A-Z]\]*/g;
// const callRegexRegGlobal = /\d+(A|M)\-[A-Z]\-\d+[A-Z]/g;
//const callRegexWestern = /\[Range \d+[A-Z]\];* Box \d+/g;
const callRegexWestern = /\[Range \d+[A-Z]\];* Box \d+/g;
// const callRegexWesternGlobal = /\[Range \d+[A-Z]\];* Box \d+/g;

const westernAncestorRef = '/repositories/2/resources/4';

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
    bib?: (
      data: RepoArchivalObject,
      extraInfo?: ArchivalObjectExtraInfo,
    ) => string;
    item?: (item: ArchivalObjectInstance, data: RepoArchivalObject) => string;
    allItems?: (data: RepoArchivalObject) => string[];
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

const condenseItemRange = (items: (string | undefined)[]) => {
  const length = items.length;
  const first = items[0];
  const last = items[length - 1];
  return `${first} ... ${last} (${length} items)`;
};

const isWesternCollection = (data: RepoArchivalObject) => {
  return (
    data.ancestors.find((ancestor) => ancestor.ref == westernAncestorRef)
      ?.ref == westernAncestorRef
  );
};

const getWesternItemCallNumbers = (data: RepoArchivalObject) => {
  const abstractNotes = data.notes.filter(
    (
      note,
    ): note is Extract<
      (typeof data.notes)[number],
      { jsonmodel_type: 'note_singlepart' }
    > =>
      note.type == 'abstract' &&
      note.jsonmodel_type == 'note_singlepart' &&
      note.content.length > 0,
  );
  const abstractString = abstractNotes
    .flatMap((note) => note.content)
    .join(' ');
  const matches = abstractString.match(callRegexWestern) || [];
  return matches;
};

const overrides: AspaceCallNumberOverrides = {
  resources: {
    bib(data) {
      const itemCallNumbers = data.instances.map(
        (item) => item.sub_container?.top_container?._resolved?.display_string,
      );
      return condenseItemRange(itemCallNumbers);
    },
  },
  archivalObject: {
    bib(data, extraInfo) {
      let summaryInfo = extraInfo?.summaryInfo ?? '';
      logger.silly('running archivalObject.bib override');
      data && logger.silly('data present');
      extraInfo &&
        logger.silly(`extraInfo present: ${JSON.stringify(extraInfo)}`);
      if (isWesternCollection(data)) {
        const matches = getWesternItemCallNumbers(data);
        return condenseItemRange(matches);
      }
      if (extraInfo) {
        console.log(JSON.stringify(extraInfo, null, 2));
        logger.silly('trying to extract call number from extraInfo...');
        let summaryInfo = `(${extraInfo.numItems} items)`;

        let derivedCallNumber =
          extraInfo.firstRecordArgusData.bibData.callNumber;
        logger.silly(`derivedCallNumber: ${derivedCallNumber}`);
        if (extraInfo.summaryInfo != '') {
          summaryInfo = extraInfo.summaryInfo;
          derivedCallNumber =
            derivedCallNumber?.replace(/\.\.\. \(\d+ items\)/, '') ?? '';
        }
        return `${derivedCallNumber}... (${summaryInfo})`;
      }
      // else, if not Western...
      const displayString = data.instances
        .map(
          (instance) =>
            instance?.sub_container?.top_container?._resolved?.indicator,
        )
        .join('; ');
      const matches = displayString.match(callRegexMost)?.join('; ');
      return matches ?? displayString;
      // return displayString;
    },

    item(itemData, data) {
      if (isWesternCollection(data)) {
        const matches = getWesternItemCallNumbers(data);
      }
      // else, if not western...
      const displayString =
        itemData.sub_container?.top_container?._resolved?.display_string;
      const matches = `${displayString?.match(callRegexMost)?.join(', ')}`;
      if (matches) {
        return matches;
      } else {
        return `${displayString || ''}`;
      }
    },

    allItems(data): string[] {
      if (isWesternCollection(data)) {
        const matches = getWesternItemCallNumbers(data);
        return matches.filter((match) => match !== undefined) ?? [];
      }
      return [];
    },
  },
};

export default overrides;
