import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';

type User = typeof users.$inferSelect;

export const findUserByEmail = async (email: string): Promise<User | undefined> => {
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return user;
};

export const updateLoginAttempts = async (
  userId: string,
  attempts: number,
  lockUntil: Date | null
): Promise<void> => {
  await db.update(users)
    .set({ loginAttempts: attempts, lockUntil })
    .where(eq(users.id, userId));
};

export const resetLoginAttempts = async (userId: string): Promise<void> => {
  await db.update(users)
    .set({ loginAttempts: 0, lockUntil: null })
    .where(eq(users.id, userId));
};

export const findUserById = async (id: string): Promise<User | undefined> => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  return user;
};

export const updateUserProfile = async (
  id: string,
  data: { name?: string; email?: string; avatarUrl?: string }
): Promise<User> => {
  const [updatedUser] = await db
    .update(users)
    .set({
      name: data.name ?? undefined,
      email: data.email ?? undefined,
      avatarUrl: data.avatarUrl ?? undefined,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning();

  return updatedUser;
};

export const updateUserPassword = async (
  id: string,
  passwordHash: string
): Promise<void> => {
  await db
    .update(users)
    .set({
      passwordHash,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id));
};