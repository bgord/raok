import { AxiosError } from "axios";
import * as bg from "@bgord/node";

export class FeedlyToken {
  private static EXPIRATION_DAYS = 30;

  static hasErrored(error: unknown): boolean {
    return FeedlyToken.isAxiosError(error) && error.response?.status === 401;
  }

  static hasExpired(lastFeedlyTokenExpiredError: bg.Falsy<number>): boolean {
    // First lastFeedlyTokenExpiredError happening
    if (!lastFeedlyTokenExpiredError) return true;

    const now = Date.now();
    const msSinceLastError = now - lastFeedlyTokenExpiredError;

    // Has last error happened before current token lifespan
    return msSinceLastError > bg.Time.Days(FeedlyToken.EXPIRATION_DAYS).toMs();
  }

  static isExpired(lastFeedlyTokenExpiredError: bg.Falsy<number>): boolean {
    return Boolean(lastFeedlyTokenExpiredError);
  }

  private static isAxiosError(error: unknown): error is AxiosError {
    return error instanceof Error && error && "isAxiosError" in error;
  }
}
