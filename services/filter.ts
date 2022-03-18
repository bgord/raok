import * as z from "zod";

export class Filter<T extends z.ZodRawShape> {
  schema: z.ZodObject<T>;

  constructor(schema: z.ZodObject<T>) {
    this.schema = schema;
  }

  parse(values: Record<string, unknown>) {
    return Filter._parse({ schema: this.schema, values });
  }

  static parse<T extends z.ZodRawShape>(config: {
    schema: z.ZodObject<T>;
    values: Record<string, unknown>;
  }) {
    return Filter._parse(config);
  }

  private static _parse<T extends z.ZodRawShape>(config: {
    schema: z.ZodObject<T>;
    values: Record<string, unknown>;
  }) {
    const result = config.schema.safeParse(config.values);
    return result.success ? result.data : undefined;
  }
}
