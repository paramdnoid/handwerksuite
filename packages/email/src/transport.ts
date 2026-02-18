import { createTransport, type Transporter } from 'nodemailer';
import { serverEnv } from '@zunftgewerk/env/server';

let _transporter: Transporter | undefined;

export function getTransporter(): Transporter {
  if (!_transporter) {
    const env = serverEnv();
    _transporter = createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
      pool: true,
      maxConnections: 5,
    } as any);
  }
  return _transporter;
}
