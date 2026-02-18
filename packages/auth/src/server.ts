import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { twoFactor } from 'better-auth/plugins';
import { db } from '@zunftgewerk/db/client';
import { users, sessions, accounts, verifications } from '@zunftgewerk/db/schema';
import { serverEnv } from '@zunftgewerk/env/server';
import { sendVerificationEmail, sendResetPasswordEmail } from '@zunftgewerk/email';

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

  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }) => {
      void sendVerificationEmail({ to: user.email, url, token });
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 12,
    sendResetPassword: async ({ user, url }) => {
      void sendResetPasswordEmail({ to: user.email, url });
    },
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
