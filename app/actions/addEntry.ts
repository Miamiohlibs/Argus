'use server';
import logger from '@/lib/logger';
import { db } from '@/lib/db';
import EntryActionData from '@/types/EntryActionData';
import { updateProjectLastUpdated } from '@/app/actions/projectActions';

const entryAction = async ({
  bibData,
  itemData,
  actionType,
  existingEntryId,
}: EntryActionData) => {
  console.log('bibData', bibData);
  // console.log('itemData', itemData);
  // console.log('actionType', actionType);
  try {
    const url =
      bibData.mms_id && process.env.ALMA_PERMALINK_BASEURL
        ? process.env.ALMA_PERMALINK_BASEURL + bibData.mms_id
        : undefined;

    logger.verbose(
      `${actionType === 'add' ? 'Adding' : 'Updating'} entry with bibData:`,
      bibData
    );

    if (bibData.project_id === undefined && bibData.projectId !== undefined) {
      bibData.project_id = bibData.projectId;
    }
    if (bibData.title === undefined && bibData.itemTitle !== undefined) {
      bibData.title = bibData.itemTitle;
    }
    // console.log('bibData.project_id', bibData.project_id);
    const projectId = parseInt(
      (bibData.project_id as string).replace(/"/g, '')
    );
    logger.verbose('Project ID:', projectId);

    const itemDescriptions = itemData.map((item) => ({
      description: item.description,
      location: item.location,
      location_code: item.location_code,
      location_name: item.location_name,
      call_number: item.call_number,
      copy_id: item.copy_id,
      barcode: item.barcode,
      box: item.box,
      folder: item.folder,
      ms: item.ms,
    }));

    const selectedLocationsArr = [
      ...new Set(itemData.map((item) => item.location)),
    ];
    const selectedLocations =
      selectedLocationsArr.length > 0
        ? selectedLocationsArr.join(',')
        : bibData.location;

    const selectedLocationNamesArr = [
      ...new Set(itemData.map((item) => item.location_name)),
    ];

    const selectedLocationNames =
      selectedLocationNamesArr.length > 0
        ? selectedLocationNamesArr.join(',')
        : bibData.locationNames;

    const selectedCallNumbersArr = [
      ...new Set(itemData.map((item) => item.call_number)),
    ];

    const selectedCallNumbers =
      selectedCallNumbersArr.length > 0
        ? selectedCallNumbersArr.join(',')
        : bibData.call_number;

    logger.verbose('received bibData', JSON.stringify(bibData));
    // Prepare the data object
    const entryData = {
      itemTitle: bibData.title as string,
      author: bibData.author as string,
      location: selectedLocations as string,
      location_codes: selectedLocations as string,
      location_display: selectedLocationNames as string,
      pub_date:
        (bibData.date_of_publication as string) ?? (bibData.pub_date as string),
      publisher: bibData.publisher_const as string,
      callNumber: selectedCallNumbers as string,
      projectId: projectId,
      totalItems: parseInt(bibData.total_item_count as string) || 1,
      url: url as string,
      notes: (bibData.holdingNote as string) ?? (bibData.notes as string),
      almaId: bibData.mms_id as string,
      almaIdType: 'mms_id' as const,
    };

    let response;

    if (actionType === 'add') {
      // Create new entry
      response = await db.bibEntry.create({
        data: {
          ...entryData,
          items: {
            create: itemDescriptions,
          },
        },
        include: {
          items: true,
        },
      });
      logger.verbose('Entry added successfully:', response);
      await updateProjectLastUpdated(projectId);
    } else {
      // Update existing entry
      if (!existingEntryId) {
        throw new Error('Existing entry ID is required for edit action');
      }

      // Use a transaction to handle both bibEntry update and items replacement
      response = await db.$transaction(async (tx) => {
        // First, delete existing items
        await tx.itemEntry.deleteMany({
          where: {
            bibEntryId: existingEntryId,
          },
        });

        // Then update the bibEntry and create new items
        const updatedEntry = await tx.bibEntry.update({
          where: {
            id: existingEntryId,
          },
          data: {
            ...entryData,
            items: {
              create: itemDescriptions,
            },
          },
          include: {
            items: true,
          },
        });
        await updateProjectLastUpdated(projectId);

        return updatedEntry;
      });

      logger.verbose('Entry updated successfully:', response);
    }

    return { data: response, error: undefined };
  } catch (error) {
    logger.error(
      `Error ${actionType === 'add' ? 'adding' : 'updating'} entry:`,
      error
    );
    return {
      data: undefined,
      error: `Failed to ${actionType === 'add' ? 'add' : 'update'} entry: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    };
  }
};

export default entryAction;
