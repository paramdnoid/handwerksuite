import { createAuthClient } from 'better-auth/client';
import { twoFactorClient } from 'better-auth/client/plugins';
import { clientEnv } from '@zunftgewerk/env/client';

function getBaseURL(): string {
  // Tauri / Vite desktop app
  if (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_AUTH_URL) {
    return (import.meta as any).env.VITE_AUTH_URL;
  }
  // Next.js apps – validated env vars via @zunftgewerk/env
  try {
    const env = clientEnv();
    return env.NEXT_PUBLIC_AUTH_URL ?? env.NEXT_PUBLIC_LANDING_URL;
  } catch {
    return 'http://localhost:3000';
  }
}

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  plugins: [twoFactorClient()],
});

export type AuthClient = typeof authClient;
