import * as bg from "@bgord/node";

import * as Events from "./events";
import * as Repos from "./repositories";
import * as Services from "./services";

import * as infra from "../../infra";

const EventHandler = new bg.EventHandler(infra.logger);

export const onArbitraryFileScheduledEventHandler =
  EventHandler.handle<Events.ArbitraryFileScheduledEventType>(async (event) => {
    const { email, ...file } = event.payload;

    try {
      await Services.ArbitraryFileSender.send(file, email);

      infra.logger.info({
        message: "Mailer success",
        operation: "mailer_success",
        metadata: { filename: file.originalFilename },
      });

      await Repos.FilesRepository.add(file);
    } catch (error) {
      infra.logger.error({
        message: "Mailer error while sending file",
        operation: "mailer_error",
        metadata: {
          filename: file.originalFilename,
          error: infra.logger.formatError(error),
        },
      });
    }
  });
