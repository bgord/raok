import * as bg from "@bgord/node";
import { z } from "zod";

export const ARTICLES_TO_REVIEW_NOTIFICATIONS_DISABLED_EVENT =
  "ARTICLES_TO_REVIEW_NOTIFICATIONS_DISABLED_EVENT";
export const ArticlesToReviewNotificationsDisabledEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(ARTICLES_TO_REVIEW_NOTIFICATIONS_DISABLED_EVENT),
    version: z.literal(1),
    payload: z.object({}),
  })
);
export type ArticlesToReviewNotificationsDisabledEventType = z.infer<
  typeof ArticlesToReviewNotificationsDisabledEvent
>;

export const ARTICLES_TO_REVIEW_NOTIFICATIONS_ENABLED_EVENT =
  "ARTICLES_TO_REVIEW_NOTIFICATIONS_ENABLED_EVENT";
export const ArticlesToReviewNotificationsEnabledEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(ARTICLES_TO_REVIEW_NOTIFICATIONS_ENABLED_EVENT),
    version: z.literal(1),
    payload: z.object({}),
  })
);
export type ArticlesToReviewNotificationsEnabledEventType = z.infer<
  typeof ArticlesToReviewNotificationsEnabledEvent
>;

export const ARTICLES_TO_REVIEW_NOTIFICATION_HOUR_SET_EVENT =
  "ARTICLES_TO_REVIEW_NOTIFICATION_HOUR_SET_EVENT";
export const ArticlesToReviewNotificationHourSetEvent = bg.EventDraft.merge(
  z.object({
    name: z.literal(ARTICLES_TO_REVIEW_NOTIFICATION_HOUR_SET_EVENT),
    version: z.literal(1),
    payload: z.object({ hour: bg.Schema.Hour }),
  })
);
export type ArticlesToReviewNotificationHourSetEventType = z.infer<
  typeof ArticlesToReviewNotificationHourSetEvent
>;
