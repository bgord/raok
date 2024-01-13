import * as VO from "../value-objects";

export class Tokenizer {
  private static WORD_REGEX = /\w+/g;

  static tokenize(input: string): VO.TokenType[] {
    const tokens = (input.match(Tokenizer.WORD_REGEX) ?? [])
      .map((token) => token.toLowerCase())
      .filter((token) => token.length > 1)
      .filter((token) => Number.isNaN(Number(token)))
      .filter((token) => !VO.STOP_WORDS.includes(token));

    return Array.from(new Set(tokens));
  }
}
