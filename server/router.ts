import { authRouter } from "./auth-router";
import { profileRouter } from "./profile-router";
import { quoteRouter } from "./quote-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  profile: profileRouter,
  quote: quoteRouter,
});

export type AppRouter = typeof appRouter;
