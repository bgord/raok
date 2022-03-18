import * as z from "zod";

export class Filter {
  static parse<T extends z.ZodRawShape>(config: {
    schema: z.ZodObject<T>;
    values: Record<string, unknown>;
  }) {
    const result = config.schema.safeParse(config.values);

    return result.success ? result.data : undefined;
  }
}
