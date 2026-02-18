import { createAuthClient } from "better-auth/client";
import { twoFactorClient } from "better-auth/client/plugins";

function getBaseURL(): string {
  // Tauri / Vite desktop app
  if (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_AUTH_URL) {
    return (import.meta as any).env.VITE_AUTH_URL;
  }
  // Next.js apps – auth routes live in the landing app
  if (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_AUTH_URL) {
    return process.env.NEXT_PUBLIC_AUTH_URL;
  }
  if (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_LANDING_URL) {
    return process.env.NEXT_PUBLIC_LANDING_URL;
  }
  return "http://localhost:3000";
}

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  plugins: [twoFactorClient()],
});

export type AuthClient = typeof authClient;
