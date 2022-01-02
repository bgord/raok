import { Reporter } from "@bgord/node";
import { ToadScheduler, SimpleIntervalJob, AsyncTask } from "toad-scheduler";

export const Scheduler = new ToadScheduler();

const task = new AsyncTask("feedly articles crawler", async () => {
  Reporter.info("Crawling Feedly articles...");
});

const job = new SimpleIntervalJob({ minutes: 100, runImmediately: true }, task);

Scheduler.addSimpleIntervalJob(job);
