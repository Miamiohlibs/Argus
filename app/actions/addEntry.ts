'use server';
import { db } from '@/lib/db';
import { ItemEntry } from '@prisma/client';

interface EntryActionData {
  bibData: Record<string, FormDataEntryValue>;
  itemData: ItemEntry[];
  actionType: 'add' | 'edit';
  existingEntryId?: string;
}

const entryAction = async ({
  bibData,
  itemData,
  actionType,
  existingEntryId,
}: EntryActionData) => {
  try {
    const url =
      bibData.mms_id && process.env.ALMA_PERMALINK_BASEURL
        ? process.env.ALMA_PERMALINK_BASEURL + bibData.mms_id
        : undefined;

    console.log(
      `${actionType === 'add' ? 'Adding' : 'Updating'} entry with bibData:`,
      bibData
    );
    console.log(`environment: ${process.env.ALMA_PERMALINK_BASEURL}`);

    const projectId = parseInt(
      (bibData.project_id as string).replace(/"/g, '')
    );
    console.log('Project ID:', projectId);

    const itemDescriptions = itemData.map((item) => ({
      description: item.description,
      location: item.location,
      call_number: item.call_number,
      copy_id: item.copy_id,
      barcode: item.barcode,
    }));

    const selectedLocations = [
      ...new Set(itemData.map((item) => item.location)),
    ].join(',');
    const selectedCallNumbers = [
      ...new Set(itemData.map((item) => item.call_number)),
    ].join(',');

    console.log('received bibData', JSON.stringify(bibData));
    // Prepare the data object
    const entryData = {
      itemTitle: bibData.title as string,
      author: bibData.author as string,
      location: selectedLocations as string,
      pub_date: bibData.date_of_publication as string,
      publisher: bibData.publisher_const as string,
      callNumber: selectedCallNumbers as string,
      projectId: projectId,
      totalItems: parseInt(bibData.total_item_count as string) || 1,
      url: url as string,
      notes: bibData.holdingNote as string,
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
      console.log('Entry added successfully:', response);
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

        return updatedEntry;
      });

      console.log('Entry updated successfully:', response);
    }

    return { data: response, error: null };
  } catch (error) {
    console.error(
      `Error ${actionType === 'add' ? 'adding' : 'updating'} entry:`,
      error
    );
    return {
      data: null,
      error: `Failed to ${actionType === 'add' ? 'add' : 'update'} entry: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    };
  }
};

export default entryAction;
