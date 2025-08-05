'use server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import AddPullList from '@/components/AddPullList';

interface PullListData {
  title: string;
  userId: string;
  notes?: string;
}

interface PullListResult {
  data?: PullListData;
  error?: string;
}

async function addPullList(formData: FormData): Promise<PullListResult> {
  const titleValue = formData.get('title');
  //   const ownerValue = formData.get('userId');
  const notesValue = formData.get('notes') ?? '';

  // check for input values
  if (!titleValue || titleValue === '') {
    return { error: 'Title or owner is missing' };
  }

  const title: string = titleValue.toString(); // ensure text is a string
  //   const userId: string = ownerValue.toString();
  const notes: string = notesValue.toString();

  // get logged in user
  const { userId } = await auth();
  console.log(userId);

  // check for user
  if (!userId) {
    return { error: 'User not found' };
  }

  try {
    // First, verify that the user exists in the database
    const existingUser = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!existingUser) {
      console.log(`User with clerkUserId ${userId} not found in database`);
      return {
        error:
          'User not found in database. Please ensure you are logged in properly.',
      };
    }

    console.log({
      data: {
        title,
        notes,
        userId,
      },
      existingUser: {
        id: existingUser.id,
        clerkUserId: existingUser.clerkUserId,
        email: existingUser.email,
      },
    });

    const created = await db.pullList.create({
      data: {
        title,
        notes,
        userId,
      },
      include: {
        user: true, // Include the user data to verify the relationship
      },
    });

    console.log('Created PullList with user relationship:', {
      pullListId: created.id,
      title: created.title,
      userId: created.userId,
      connectedUser: created.user
        ? {
            id: created.user.id,
            clerkUserId: created.user.clerkUserId,
            email: created.user.email,
          }
        : null,
    });

    const pullListData: PullListData = {
      title: created.title,
      userId: created.userId,
      notes: created.notes ?? undefined,
    };
    revalidatePath('/');
    return { data: pullListData };
  } catch (error) {
    console.error('Error creating PullList:', error);
    return { error: 'PullList not added: ' + JSON.stringify(error) };
  }
}

export default addPullList;
