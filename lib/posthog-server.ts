import { PostHog } from "posthog-node";
import "server-only";

export default function PostHogClient() {
  const posthogClient = new PostHog(
    process.env.NEXT_PUBLIC_POSTHOG_KEY as string,
    {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      flushAt: process.env.NODE_ENV === "production" ? 1 : 0, // Flush only in production
      flushInterval: 0,
    }
  );
  return posthogClient;
}
