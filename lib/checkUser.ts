import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export const checkUser = async () => {
  const user = await currentUser();
  // console.log(user);
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
  const newUser = await db.user.create({
    data: {
      clerkUserId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
    },
  });

  return newUser;
};
