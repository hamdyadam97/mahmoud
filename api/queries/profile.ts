import { getDb } from "./connection";
import { profiles } from "@db/schema";
import type { ProfileContent } from "@contracts/content";
import { eq } from "drizzle-orm";

export async function findProfileByUser(userId: number) {
  return getDb().query.profiles.findFirst({
    where: eq(profiles.userId, userId),
  });
}

export async function upsertProfile(userId: number, data: ProfileContent) {
  await getDb()
    .insert(profiles)
    .values({ userId, data })
    .onDuplicateKeyUpdate({ set: { data } });
  return findProfileByUser(userId);
}
