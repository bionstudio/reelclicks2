/**
 * Simple in-memory sliding-window rate limiter.
 * Note: on serverless hosting each instance keeps its own memory, so this is a
 * light first line of defence (Turnstile + honeypot do the heavy lifting).
 * Swap for Upstash Redis if spam ever becomes a problem.
 */
const hits = new Map<string, number[]>();

export function rateLimit(key: string, limit = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return { ok: false, retryAfter: Math.ceil((windowMs - (now - recent[0])) / 1000) };
  }
  recent.push(now);
  hits.set(key, recent);
  // Keep memory bounded.
  if (hits.size > 5000) hits.delete(hits.keys().next().value as string);
  return { ok: true, retryAfter: 0 };
}
