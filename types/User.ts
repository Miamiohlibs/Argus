export interface User {
  id: string;
  clerkUserId: string;
  email: string;
  name: string;
  role: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
