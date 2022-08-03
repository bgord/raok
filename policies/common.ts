import { Time } from "../services/time";

export function hasNewspaperStalled(config: {
  status: string;
  scheduledAt: number;
}) {
  const now = Date.now();
  const cutoff = new Time.Minutes(10).toMs();

  const hasCutoffPassed = now - config.scheduledAt > cutoff;

  return (
    ["scheduled", "ready_to_send"].includes(config.status) && hasCutoffPassed
  );
}
