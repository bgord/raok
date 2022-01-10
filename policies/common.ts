export function hasNewspaperStalled(config: {
  status: string;
  scheduledAt: number;
}) {
  const now = Date.now();
  const cutoff = 10 * 60 * 1000; // 10 minutes

  const hasCutoffPassed = now - config.scheduledAt > cutoff;

  return (
    ["scheduled", "ready_to_send"].includes(config.status) && hasCutoffPassed
  );
}
