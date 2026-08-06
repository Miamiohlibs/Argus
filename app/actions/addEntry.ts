'use server';
import logger from '@/lib/logger';
import { db } from '@/lib/db';
import EntryActionData from '@/types/EntryActionData';
import { updateProjectLastUpdated } from '@/app/actions/projectActions';

const entryAction = async ({
  bibData,
  itemData,
  projectId,
  actionType,
  existingEntryId,
}: EntryActionData) => {
  try {
    logger.verbose(
      `${actionType === 'add' ? 'Adding' : 'Updating'} entry with bibData:`,
      bibData,
    );
    logger.verbose('Project ID:', projectId);

    const itemDescriptions = itemData.map((item) => ({
      description: item.description,
      location_code: item.location_code,
      location_name: item.location_name,
      call_number: item.call_number,
      copy_id: item.copy_id,
      barcode: item.barcode,
      box: item.box,
      folder: item.folder,
      ms: item.ms,
    }));

    const selectedLocationCodesArr = [
      ...new Set(itemData.map((item) => item.location_code)),
    ];
    const selectedLocationCodes =
      selectedLocationCodesArr.length > 0
        ? selectedLocationCodesArr.join(',')
        : bibData.location_codes;

    const selectedLocationNamesArr = [
      ...new Set(itemData.map((item) => item.location_name)),
    ];
    const selectedLocationNames =
      selectedLocationNamesArr.length > 0
        ? selectedLocationNamesArr.join(',')
        : bibData.location_display;

    const selectedCallNumbersArr = [
      ...new Set(itemData.map((item) => item.call_number)),
    ];
    const selectedCallNumbers =
      selectedCallNumbersArr.length > 0
        ? selectedCallNumbersArr.join(',')
        : bibData.callNumber;

    // Prepare the data object
    const entryData = {
      itemTitle: bibData.itemTitle,
      author: bibData.author ?? '',
      location_codes: selectedLocationCodes,
      location_display: selectedLocationNames,
      pub_date: bibData.pub_date,
      publisher: bibData.publisher,
      callNumber: selectedCallNumbers,
      projectId,
      totalItems: bibData.totalItems ?? 1,
      url: bibData.url,
      notes: bibData.notes,
      catalogId: bibData.catalogId,
      catalogIdType: bibData.catalogIdType,
      catalog: bibData.catalog,
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
      error,
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
