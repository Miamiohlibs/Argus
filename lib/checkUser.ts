import logger from '@/lib/logger';
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';

export const checkUser = async () => {
  const user = await currentUser();
  logger.silly(user);
  //check for current logged in clerk user
  if (!user) {
    return null;
  }

  // check if user is already in the database
  const loggedInUser = await db.user.findUnique({
    where: {
      clerkUserId: user.id,
    },
  });

  // if user is in the database, return user
  if (loggedInUser) {
    return loggedInUser;
  }

  // if not in the database, create user

  try {
    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name: `${user.firstName} ${user.lastName}`,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
        role: 'user',
      },
    });
    return newUser;
  } catch (error) {
    // something is causing this code to be hit twice, and the second time it tries to create a user again
    // need to catch it and return the user on the second go
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        // duplicate id on create user
        checkUser(); // try again
      }
    } else {
      logger.error('An unexpected error occurred:', error);
    }
  }

  // return newUser;
};
