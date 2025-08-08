'use server';
// import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
// import { revalidatePath } from 'next/cache';
// import { redirect } from 'next/navigation';
// import { redirect } from 'next/dist/server/api-utils';

const addEntry = async ({
  bibData,
  itemData,
}: {
  bibData: Record<string, FormDataEntryValue>;
  itemData: any[];
}) => {
  try {
    console.log('Adding entry with bibData:', bibData);
    const projectId = parseInt((bibData.project_id as string).replace('"', ''));
    console.log('Project ID:', projectId);
    const itemDescriptions = itemData.map((item) => ({
      description: item.description,
    }));
    const response = await db.bibEntry.create({
      data: {
        itemTitle: bibData.title as string,
        author: bibData.author as string,
        location: bibData.holdings_location_code as string,
        callNumber: bibData.holdings_call as string,
        projectId: projectId,
        totalItems: parseInt(bibData.total_item_count as string) || 1,
        notes: bibData.holdingNote as string,
        almaId: bibData.mms_id as string,
        almaIdType: 'mms_id',
        items: {
          create: itemDescriptions,
        },
      },
    });
    console.log('Entry added successfully:', response);
    return { data: response, error: null };
  } catch (error) {
    console.error('Error adding entry:', error);
    return { data: null, error: 'Failed to add entry' };
  }
};

export default addEntry;
