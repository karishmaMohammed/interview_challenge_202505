import { db, users } from "~/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

// Get a user by email
export async function getUserByEmail(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user || null;
}

// Create a new user
export async function createUser(email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const [user] = await db
    .insert(users)
    .values({
      email,
      password: hashedPassword, // ✅ matches schema field
    })
    .returning();

  return user;
}
