import { z } from 'zod';

const clientSchema = z.object({
  NEXT_PUBLIC_LANDING_URL: z.string().url(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_AUTH_URL: z.string().url(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith('pk_').optional(),
});

export type ClientEnv = z.infer<typeof clientSchema>;

let _clientEnv: ClientEnv | undefined;

export function clientEnv(): ClientEnv {
  if (!_clientEnv) {
    const parsed = clientSchema.safeParse({
      NEXT_PUBLIC_LANDING_URL: process.env.NEXT_PUBLIC_LANDING_URL,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      NEXT_PUBLIC_AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL,
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    });
    if (!parsed.success) {
      console.error('Invalid client environment variables:', parsed.error.flatten().fieldErrors);
      throw new Error('Invalid client environment variables');
    }
    _clientEnv = parsed.data;
  }
  return _clientEnv;
}
