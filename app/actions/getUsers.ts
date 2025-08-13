'use server';
import { db } from '@/lib/db';
import { User } from '@prisma/client';

async function getUsers(): Promise<{
  users?: User[];
  error?: string;
}> {
  try {
    const users = await db.user.findMany();
    console.log('Fetched users:', users);
    if (!users || users.length === 0) {
      return { error: 'No users found' };
    }
    return { users };
  } catch (error) {
    console.log('DB error:', error);
    return { error: 'Database error' };
  }
}

export default getUsers;
