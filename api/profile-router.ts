import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";
import { findProfileByUser, upsertProfile } from "./queries/profile";
import { DESCRIPTION_LIMIT } from "@contracts/content";

const serviceItemSchema = z.object({
  title: z.string().min(1).max(200),
  desc: z.string().min(1).max(1000),
});

const contentSchema = z.object({
  companyName: z.string().min(1).max(255),
  category: z.string().max(255),
  phone: z.string().max(50),
  whatsapp: z.string().max(50),
  address: z.string().max(500),
  workingHours: z.string().max(255),
  serviceAreas: z.string().max(2000),
  description: z.string().min(1).max(DESCRIPTION_LIMIT),
  services: z
    .array(
      z.object({
        category: z.string().min(1).max(255),
        items: z.array(serviceItemSchema).max(20),
      }),
    )
    .max(20),
  reviews: z
    .array(
      z.object({
        author: z.string().min(1).max(255),
        city: z.string().max(255),
        text: z.string().min(1).max(2000),
      }),
    )
    .max(30),
  posts: z
    .array(
      z.object({
        title: z.string().min(1).max(255),
        body: z.string().min(1).max(1500),
        cta: z.string().max(255),
      }),
    )
    .max(30),
  faqs: z
    .array(
      z.object({
        q: z.string().min(1).max(500),
        a: z.string().min(1).max(2000),
      }),
    )
    .max(30),
});

export const profileRouter = createRouter({
  // استرجاع محتوى المستخدم الحالي (أو null إن لم يسبق له الحفظ)
  mine: authedQuery.query(async ({ ctx }) => {
    const row = await findProfileByUser(ctx.user.id);
    return row ? { data: row.data, updatedAt: row.updatedAt } : null;
  }),

  // حفظ المحتوى المعدّل
  save: authedQuery
    .input(z.object({ data: contentSchema }))
    .mutation(async ({ ctx, input }) => {
      const row = await upsertProfile(ctx.user.id, input.data);
      return { data: row!.data, updatedAt: row!.updatedAt };
    }),
});
