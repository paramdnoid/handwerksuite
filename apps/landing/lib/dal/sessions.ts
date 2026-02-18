import { db } from "@zunftgewerk/db/client";
import { sessions } from "@zunftgewerk/db/schema";
import { eq, and, gt, ne } from "drizzle-orm";

// ── Types ───────────────────────────────────────────────

export interface SessionInfo {
  id: string;
  device: string;
  ip: string;
  lastActive: Date;
  isCurrent: boolean;
}

// ── Parse User Agent ────────────────────────────────────

function parseUserAgent(userAgent: string | null): string {
  if (!userAgent) return "Unbekanntes Gerät";

  let browser = "Browser";
  if (userAgent.includes("Chrome") && !userAgent.includes("Edg"))
    browser = "Chrome";
  else if (userAgent.includes("Safari") && !userAgent.includes("Chrome"))
    browser = "Safari";
  else if (userAgent.includes("Firefox")) browser = "Firefox";
  else if (userAgent.includes("Edg")) browser = "Edge";

  let os = "";
  if (userAgent.includes("Macintosh") || userAgent.includes("Mac OS"))
    os = "macOS";
  else if (userAgent.includes("Windows")) os = "Windows";
  else if (userAgent.includes("iPhone")) os = "iPhone";
  else if (userAgent.includes("iPad")) os = "iPad";
  else if (userAgent.includes("Android")) os = "Android";
  else if (userAgent.includes("Linux")) os = "Linux";

  return os ? `${browser} auf ${os}` : browser;
}

// ── Get User Sessions ───────────────────────────────────

export async function getUserSessions(
  userId: string,
  currentSessionToken: string,
): Promise<SessionInfo[]> {
  const activeSessions = await db
    .select()
    .from(sessions)
    .where(
      and(eq(sessions.userId, userId), gt(sessions.expiresAt, new Date())),
    )
    .orderBy(sessions.updatedAt);

  return activeSessions.map((s) => ({
    id: s.id,
    device: parseUserAgent(s.userAgent),
    ip: s.ipAddress ?? "Unbekannt",
    lastActive: s.updatedAt,
    isCurrent: s.token === currentSessionToken,
  }));
}

// ── Revoke Session ──────────────────────────────────────

export async function revokeSession(sessionId: string, userId: string) {
  await db
    .delete(sessions)
    .where(and(eq(sessions.id, sessionId), eq(sessions.userId, userId)));
}

// ── Revoke All Other Sessions ───────────────────────────

export async function revokeAllOtherSessions(
  userId: string,
  currentSessionToken: string,
) {
  await db
    .delete(sessions)
    .where(
      and(
        eq(sessions.userId, userId),
        ne(sessions.token, currentSessionToken),
      ),
    );
}
