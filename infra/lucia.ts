import { Lucia, TimeSpan } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";

import { Env } from "./env";
import { db, User } from "./db";

const adapter = new PrismaAdapter(db.session, db.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: { attributes: { secure: Env.type === "production" } },
  sessionExpiresIn: new TimeSpan(4, "w"),
  getUserAttributes: (attributes) => ({
    email: attributes.email,
    password: attributes.password,
  }),
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }

  interface DatabaseUserAttributes {
    email: User["email"];
    password: User["password"];
  }
}
