import { getDb } from "./connection";
import { quoteRequests } from "@db/schema";
import { desc } from "drizzle-orm";

export async function createQuoteRequest(data: {
  name: string;
  phone: string;
  furnitureSize: string;
  fromCity: string;
  toCity: string;
  moveDate: string;
  notes?: string;
}) {
  const [{ id }] = await getDb().insert(quoteRequests).values(data).$returningId();
  return id;
}

export async function listQuoteRequests() {
  return getDb().query.quoteRequests.findMany({
    orderBy: desc(quoteRequests.createdAt),
    limit: 200,
  });
}
