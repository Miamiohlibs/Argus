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

const callRegexMost =
  /((Box\:* *)*\d+)*[, ]*(\[*\d+(A|M)\-[A-Z]\-\d+[A-Z]\]*)[, ]*(Folder\:* \d+)*/g;
// const callRegexRegGlobal = /\d+(A|M)\-[A-Z]\-\d+[A-Z]/g;
//const callRegexWestern = /\[Range \d+[A-Z]\];* Box \d+/g;
const callRegexWestern = /(\[Range \d+[A-Z]\];* Box \d+)/g;
// const callRegexWesternGlobal = /\[Range \d+[A-Z]\];* Box \d+/g;

const westernAncestorRef = '/repositories/2/resources/4';

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
    async bib(data: RepoResources, client: AspaceClient) {
      if (data.hasOwnProperty('instances') && data.instances.length > 0) {
        const itemCallNumbers = data.instances.map(
          (item) =>
            item.sub_container?.top_container?._resolved?.display_string,
        );
        return condenseItemRange(itemCallNumbers);
      } else if (data.tree) {
        /* 
        else, get the resource tree, look for children
        count children (could be subgrp)
        get first item call number
        display first item and number of children
        */

        const treeUrlString = `${client.baseUrl}${data.tree.ref.replace('/tree', '')}`;
        logger.debug(`FETCHING TREE DATA from: ${treeUrlString}`);
        const response = await client.getUrl(treeUrlString, {
          resolve: ['tree'],
        });

        const extraInfo = await getExtraInfoFromNode(
          response.tree._resolved,
          client,
        );
        logger.debug(`BIB EXTRA INFO: ${JSON.stringify(extraInfo)}`);
        let extraInfoCall;
        let firstCall;

        // if there's no callnumber in the summary, and
        // the first record includes call number info, get the first
        // call-number-looking thing to include it in the summary
        if (
          !extraInfo.summaryInfo.match(callRegexMost) &&
          !extraInfo.summaryInfo.match(callRegexWestern)
        ) {
          if (
            extraInfo.firstRecordArgusData?.bibData?.callNumber?.match(
              callRegexMost,
            )
          ) {
            extraInfoCall = extraInfo.firstRecordArgusData.bibData.callNumber;
            const results = [...extraInfoCall.matchAll(callRegexMost)].map(
              (match) => match[1],
            );
            firstCall = results[0];
            return `${firstCall}... (${extraInfo.summaryInfo})`;
          } else if (
            extraInfo.firstRecordArgusData?.bibData?.callNumber?.match(
              callRegexWestern,
            )
          ) {
            extraInfoCall = extraInfo.firstRecordArgusData.bibData.callNumber;
            const results = [...extraInfoCall.matchAll(callRegexWestern)].map(
              (match) => match[1],
            );
            firstCall = results[0];
            return `${firstCall}... (${extraInfo.summaryInfo})`;
          }
          return extraInfo.summaryInfo;
        }
      }

      return 'Unknown';
    },
  },
  archivalObject: {
    async bib(data, client, extraInfo) {
      let summaryInfo = extraInfo?.summaryInfo ?? '';
      logger.debug('running archivalObject.bib override');
      data && logger.debug('data present');
      extraInfo &&
        logger.debug(`extraInfo present: ${JSON.stringify(extraInfo)}`);
      if (isWesternCollection(data)) {
        const matches = getWesternItemCallNumbers(data);
        return condenseItemRange(matches);
      }
      // else, if not Western...
      if (extraInfo) {
        logger.debug(JSON.stringify(extraInfo, null, 2));
        logger.debug('trying to extract call number from extraInfo...');
        let summaryInfo = `(${extraInfo.numItems} items)`;

        let derivedCallNumber =
          extraInfo.firstRecordArgusData?.bibData.callNumber;
        logger.debug(`derivedCallNumber: ${derivedCallNumber}`);
        if (extraInfo.summaryInfo != '') {
          summaryInfo = extraInfo.summaryInfo;
          derivedCallNumber =
            derivedCallNumber?.replace(/\.\.\. \(\d+ items\)/, '') ?? '';
        }
        return `${derivedCallNumber}... (${summaryInfo})`;
      }

      const displayString = data.instances
        .map((instance) => {
          return getCallNumberFromInstance(instance);
          // instance?.sub_container?.top_container?._resolved?.indicator,
        })
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
