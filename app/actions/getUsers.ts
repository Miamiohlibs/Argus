'use server';
import logger from '@/lib/logger';
import { db } from '@/lib/db';
import { User } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { Role } from '@prisma/client';

async function getUsers(roles?: Role[]): Promise<{
  users?: User[];
  error?: string;
}> {
  try {
    const where: Prisma.UserWhereInput = {};

    if (roles?.length) {
      where.role = { in: roles };
    }

    const users = await db.user.findMany({ where });

    // logger.verbose('Fetched users:', users);
    if (!users || users.length === 0) {
      return { error: 'No users found' };
    }
    return { users };
  } catch (error) {
    logger.error('DB error:', error);
    return { error: 'Database error' };
  }
}

export default getUsers;
