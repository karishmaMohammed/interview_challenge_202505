import { queries, type User } from "~/db/schema";
import { db, users } from "~/db/schema";
import { sql } from "drizzle-orm";
import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { getUserSession } from "./session.server";

export async function login(email: string, password: string) {
  // Find user by email
  const [user] = await queries.users.findByEmail(email);

  // No user found or password doesn't match
  if (!user || user.password !== password) {
    return null;
  }

  return user;
}

export async function authenticateUser(
  email: string,
  password: string
): Promise<User | null> {
  const [user] = await db
    .select()
    .from(users)
    .where(sql`${users.email} = ${email} AND ${users.password} = ${password}`);
  return user || null;
}

export async function getUserById(id: number): Promise<User | null> {
  const [user] = await queries.users.findById(id);
  return user || null;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      password: users.password,
      createdAt: users.createdAt,
      isFavorite: users.isFavorite
    })
    .from(users)
    .where(sql`${users.email} = ${email}`);
  return user || null;
}

export async function createUser(email: string, password: string): Promise<User> {
  const [user] = await db
    .insert(users)
    .values({
      email,
      password,
      isFavorite: 0,
      createdAt: new Date()
    })
    .returning({
      id: users.id,
      email: users.email,
      password: users.password,
      createdAt: users.createdAt,
      isFavorite: users.isFavorite
    });
  return user;
}

export async function requireUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  
  if (!userId || typeof userId !== "number") {
    throw redirect("/login");
  }
  
  return userId;
}
