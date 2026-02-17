import { createAuthClient } from "better-auth/client";
import { organizationClient, twoFactorClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000",
  plugins: [
    organizationClient(),
    twoFactorClient(),
  ],
});

export type AuthClient = typeof authClient;
