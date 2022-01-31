import execa from "execa";

export class EpubToMobiConverter {
  static async convert(epub: string, mobi: string) {
    await execa("ebook-convert", [epub, mobi]);
  }
}
