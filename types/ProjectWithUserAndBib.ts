import type { Prisma } from '@prisma/client';

// Define the type that matches what you're actually returning
export type ProjectWithUserAndBib = Prisma.ProjectGetPayload<{
  include: { user: true; bibEntries: true };
}>;
