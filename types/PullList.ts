export interface PullList {
  id: string;
  title: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

/*
model PullList {
  id          Int       @id @default(autoincrement())
  title       String
  user        User      @relation(fields: [userId], references: [clerkUserId], onDelete: Cascade)
  userId      String
  notes       String?
  needForDate DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
  */
