export class FileMimeTypes {
  static value = ["text/plain", "text/html", "application/epub+zip"];

  static form() {
    return FileMimeTypes.value.join(", ");
  }
}
