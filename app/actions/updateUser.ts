'use server';
import { db } from '@/lib/db';
// import { User } from '@/types/User';
import { User } from '@prisma/client';

async function updateUser(
  id: string,
  data: Partial<User>
): Promise<{ user?: User; error?: string }> {
  try {
    const updatedUser = await db.user.update({
      where: { id },
      data: {
        ...data,
      },
    });
    console.log('Updated user:', updatedUser);
    const safeUser: User = {
      ...updatedUser,
      name: updatedUser.name ?? undefined,
      imageUrl: updatedUser.imageUrl ?? null,
    };
    return { user: safeUser };
  } catch (error) {
    console.log('DB error:', error);
    return { error: 'Database error' };
  }
}
// async function getUser(id: string): Promise<{
//   user?: User | undefined;
//   error?: string;
// }> {
//   try {
//     const user = await db.user.findUniqueOrThrow({
//       where: {
//         id,
//       },
//     });
//     console.log('Fetched user:', user);
//     if (!user || user === null) {
//       return { error: 'No user found' };
//     }
//     // Ensure 'name' is string or undefined, not null
//     // Ensure 'imageUrl' is string or undefined, not null
//     const safeUser = {
//       ...user,
//       name: user.name ?? undefined,
//       imageUrl: user.imageUrl ?? undefined,
//     };
//     return { user: safeUser };
//   } catch (error) {
//     console.log('DB error:', error);
//     return { error: 'Database error' };
//   }
// }

export default updateUser;
