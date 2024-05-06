import * as fs from "fs/promises";
import * as infra from "../infra";

async function main() {
  const files = await infra.db.files.findMany({ orderBy: { sentAt: "asc" } });

  for (const file of files) {
    try {
      await fs.access(file.path);
      infra.logger.info({
        message: "Archive file exists",
        operation: "archive_files_cleanup_file_exists",
        metadata: { file },
      });
    } catch (error) {
      infra.logger.error({
        message: "Archive file does not exist",
        operation: "archive_files_cleanup_file_does_not_exists",
        metadata: { file },
      });
      await infra.db.files.delete({ where: { id: file.id } });
      infra.logger.info({
        message: "Archive file deleted",
        operation: "archive_files_cleanup_file_deleted",
        metadata: { file },
      });
    }
  }
}

main();
