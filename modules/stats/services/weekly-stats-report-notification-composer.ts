import * as bg from "@bgord/node";
import { format } from "date-fns";

import * as infra from "../../../infra";
import { WeeklyStatsRange } from "./weekly-stats-range";
import { WeeklyStats } from "./weekly-stats";

type WeeklyStatsNotificationType = {
  subject: bg.Schema.EmailSubjectType;
  html: bg.Schema.EmailContentHtmlType;
};

export class WeeklyStatsReportNotificationComposer {
  private constructor(
    private readonly notification: WeeklyStatsNotificationType,
  ) {}

  static compose(stats: WeeklyStats, range: WeeklyStatsRange) {
    const from = format(range.from, "yyyy-MM-dd");
    const to = format(range.to, "yyyy-MM-dd");

    const notification = {
      subject: bg.Schema.EmailSubject.parse(
        `📈 [RAOK] Weekly stats report ${from}-${to}`,
      ),
      html: bg.Schema.EmailContentHtml.parse(`
        <h4>Weekly stats report from the last week</h4>

        <div>Articles added: <strong>${stats.value.articlesAdded}</strong> (<strong>${stats.value.articlesAddedPerDay}</strong> per day)</div>
        <div>Articles deleted: <strong>${stats.value.articlesDeleted}</strong></div>
        <div>Articles opened: <strong>${stats.value.articlesOpened}</strong></div>
        <div>Articles read: <strong>${stats.value.articlesRead}</strong></div>
        <div>Articles processed: <strong>${stats.value.articlesProcessed}</strong></div>
      `),
    };

    return new WeeklyStatsReportNotificationComposer(notification);
  }

  async send(to: bg.Schema.EmailToType) {
    return infra.Mailer.send({
      ...this.notification,
      to,
      from: infra.Env.EMAIL_FROM,
    });
  }
}
