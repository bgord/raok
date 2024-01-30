import z from "zod";
import { Argon2id } from "oslo/password";

type PasswordType = string;
type HashedPasswordType = string;

export class Password {
  private schema: z.ZodSchema = z.string().min(1).max(256);

  private value: PasswordType;

  constructor(value: PasswordType, schema?: z.ZodSchema) {
    this.schema = schema ?? this.schema;
    this.value = this.schema.parse(value);
  }

  async hash(): Promise<HashedPassword> {
    return HashedPassword.fromPassword(this);
  }

  read(): PasswordType {
    return this.value;
  }
}

export class HashedPassword {
  private constructor(private value: HashedPasswordType) {}

  static async fromPassword(password: Password) {
    const hash = await new Argon2id().hash(password.read());

    return new HashedPassword(hash);
  }

  static async fromHash(value: HashedPasswordType) {
    return new HashedPassword(value);
  }

  read(): HashedPasswordType {
    return this.value;
  }

  async matches(password: Password): Promise<boolean> {
    return new Argon2id().verify(this.read(), password.read());
  }
}
