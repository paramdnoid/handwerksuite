import { betterAuth } from "better-auth";
import { organization, twoFactor } from "better-auth/plugins";

export const auth = betterAuth({
  database: {
    type: "postgres",
    url: process.env.DATABASE_URL!,
  },

  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL,

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 12,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      enabled: !!process.env.GOOGLE_CLIENT_ID,
    },
    microsoft: {
      clientId: process.env.MICROSOFT_CLIENT_ID ?? "",
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET ?? "",
      enabled: !!process.env.MICROSOFT_CLIENT_ID,
    },
  },

  plugins: [
    organization({
      allowUserToCreateOrganization: true,
      organizationLimit: 5,
      creatorRole: "owner",
      memberRoleHierarchy: ["owner", "admin", "manager", "employee", "readonly"],
    }),
    twoFactor({
      issuer: "HandwerkSuite",
    }),
  ],

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },

  user: {
    additionalFields: {
      craftType: {
        type: "string",
        required: false,
      },
      hwkNumber: {
        type: "string",
        required: false,
      },
    },
  },

  rateLimit: {
    window: 60,
    max: 10,
  },
});

export type Auth = typeof auth;
