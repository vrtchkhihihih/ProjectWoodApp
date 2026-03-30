import { createAnalyticsEvent } from "@/lib/api";

declare global {
  interface Window {
    ym?: (...args: unknown[]) => void;
    __yaCounterId?: number;
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export async function trackEvent(eventType: string, payload?: Record<string, unknown>, userId?: number) {
  try {
    await createAnalyticsEvent({
      user_id: userId,
      event_type: eventType,
      page_url: typeof window !== "undefined" ? window.location.pathname : undefined,
      payload_json: payload ? JSON.stringify(payload) : undefined,
    });
  } catch {}

  if (
    typeof window !== "undefined" &&
    typeof window.ym === "function" &&
    typeof window.__yaCounterId === "number"
  ) {
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: eventType,
        payload: payload ?? {},
      });
      window.ym(window.__yaCounterId, "reachGoal", eventType, payload ?? {});
    } catch {}
  }
}
