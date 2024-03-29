import * as bg from "@bgord/node";
import { Lucia, TimeSpan } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";

import { Env } from "./env";
import { db, User, Session } from "./db";

const adapter = new PrismaAdapter(db.session, db.user);

const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: Env.type === bg.Schema.NodeEnvironmentEnum.production,
    },
  },
  sessionExpiresIn: new TimeSpan(4, "w"),
  getUserAttributes: (attributes) => ({
    email: attributes.email,
    password: attributes.password,
  }),
});

export const AuthShield = new bg.AuthShield<User>({
  lucia,
  findUniqueUserOrThrow: (username: bg.Username) =>
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
