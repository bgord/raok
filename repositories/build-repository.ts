import packageJson from "../package.json";

export class BuildRepository {
  static getAll() {
    return { BUILD_DATE: Date.now(), BUILD_VERSION: `v${packageJson.version}` };
  }
}
