import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { twoFactor } from 'better-auth/plugins';
import { db } from '@zunftgewerk/db/client';
import { users, sessions, accounts, verifications } from '@zunftgewerk/db/schema';
import { serverEnv } from '@zunftgewerk/env/server';

const env = serverEnv();

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: users,
      session: sessions,
      account: accounts,
      verification: verifications,
    },
  }),

  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,

  advanced: {
    generateId: ({ model: _model, size: _size }: { model: string; size: number }) =>
      crypto.randomUUID(),
    database: {
      generateId: 'uuid',
    },
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 12,
  },

  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: env.GOOGLE_CLIENT_SECRET ?? '',
      enabled: !!env.GOOGLE_CLIENT_ID,
    },
    microsoft: {
      clientId: env.MICROSOFT_CLIENT_ID ?? '',
      clientSecret: env.MICROSOFT_CLIENT_SECRET ?? '',
      enabled: !!env.MICROSOFT_CLIENT_ID,
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },

  rateLimit: {
    window: 60,
    max: 10,
  },

  plugins: [twoFactor()],
});

export type Auth = typeof auth;
