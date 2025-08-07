'use server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
// import { revalidatePath } from 'next/cache';
// import { redirect } from 'next/navigation';
// import { redirect } from 'next/dist/server/api-utils';

const addEntry = async () => {
  try {
    const response = await db.bibEntry.create({
      data: {
        itemTitle: 'New Entry',
        notes: 'This is a new entry',
        almaId: '123456789',
        almaIdType: 'mms_id',
        author: 'John Doe',
        location: 'Main Library',
        projectId: 18,
        items: {
          create: [
            {
              description: 'Item 1',
            },
          ],
        },
      },
    });
    return { data: response, error: null };
  } catch (error) {
    console.error('Error adding entry:', error);
    return { data: null, error: 'Failed to add entry' };
  }
};

export default addEntry;
