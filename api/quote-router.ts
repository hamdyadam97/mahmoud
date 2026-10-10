import { z } from "zod";
import { createRouter, publicQuery, authedQuery } from "./middleware";
import { createQuoteRequest, listQuoteRequests } from "./queries/quotes";

const saudiPhone = /^(\+?966|0)?5\d{8}$/;

export const quoteRouter = createRouter({
  // إرسال طلب عرض سعر — متاح للزوار بدون تسجيل
  submit: publicQuery
    .input(
      z.object({
        name: z.string().min(2, "الاسم مطلوب").max(255),
        phone: z
          .string()
          .regex(saudiPhone, "أدخل رقم جوال سعودي صحيح (مثال: 05XXXXXXXX)"),
        furnitureSize: z.string().min(1).max(100),
        fromCity: z.string().min(2).max(255),
        toCity: z.string().min(2).max(255),
        moveDate: z.string().min(1).max(50),
        notes: z.string().max(1000).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const id = await createQuoteRequest(input);
      return { id };
    }),

  // قائمة الطلبات — لصاحب الموقع بعد تسجيل الدخول
  list: authedQuery.query(() => listQuoteRequests()),
});
