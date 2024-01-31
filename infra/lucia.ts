import { Lucia, TimeSpan } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";

import * as Auth from "../auth";
import { Env } from "./env";
import { db, User, Session } from "./db";

const adapter = new PrismaAdapter(db.session, db.user);

const lucia = new Lucia(adapter, {
  sessionCookie: { attributes: { secure: Env.type === "production" } },
  sessionExpiresIn: new TimeSpan(4, "w"),
  getUserAttributes: (attributes) => ({
    email: attributes.email,
    password: attributes.password,
  }),
});

export const AuthShield = new Auth.AuthShield<User>({
  lucia,
  findUniqueUserOrThrow: (username: Auth.Username) =>
    db.user.findUniqueOrThrow({ where: { email: username.read() } }),
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

declare global {
  namespace Express {
    interface Locals {
      user: User | null;
      session: Session | null;
    }
  }
}
