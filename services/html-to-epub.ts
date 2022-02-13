import execa from "execa";

export class HtmlToEpubConverter {
  static async convert(html: string, epub: string) {
    await execa("pandoc", ["-o", epub, html]);
  }
}
