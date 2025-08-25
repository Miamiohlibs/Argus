'use server';
import { db } from '@/lib/db';
// import { User } from '@/types/User';
import { User } from '@prisma/client';

export async function getUserByClerkUserId(clerkUserId: string): Promise<{
  user?: User | undefined;
  error?: string;
}> {
  try {
    const user = await db.user.findUniqueOrThrow({
      where: {
        clerkUserId,
      },
    });
    console.log('Fetched user by Clerk ID:', user);
    if (!user || user === null) {
      return { error: 'No user found' };
    }
    return { user };
  } catch (error) {
    console.log('DB error:', error);
    return { error: 'Database error' };
  }
}

export default async function getUser(id: string): Promise<{
  user?: User | undefined;
  error?: string;
}> {
  try {
    const user = await db.user.findUniqueOrThrow({
      where: {
        id,
      },
    });
    console.log('Fetched user:', user);
    if (!user || user === null) {
      return { error: 'No user found' };
    }
    // Ensure 'name' is string or undefined, not null
    // Ensure 'imageUrl' is string or undefined, not null
    const safeUser = {
      ...user,
      name: user.name ?? undefined,
      imageUrl: user.imageUrl ?? null,
    };
    return { user: safeUser };
  } catch (error) {
    console.log('DB error:', error);
    return { error: 'Database error' };
  }
}
