import { AxiosError } from "axios";

export class FeedlyToken {
  static EXPIRATION_DAYS = 30;

  static hasErrored(error: unknown): boolean {
    return FeedlyToken.isAxiosError(error) && error.response?.status === 401;
  }

  private static isAxiosError(error: unknown): error is AxiosError {
    return error instanceof Error && error && "isAxiosError" in error;
  }
}
