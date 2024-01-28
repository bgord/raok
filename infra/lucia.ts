import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";

import { Env } from "./env";
import { db } from "./db";

const adapter = new PrismaAdapter(db.session, db.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: { attributes: { secure: Env.type === "production" } },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
  }
}
