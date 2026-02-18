import { sendEmail } from '../send';

interface SendVerificationEmailOptions {
  to: string;
  url: string;
  token: string;
}

export async function sendVerificationEmail(options: SendVerificationEmailOptions): Promise<void> {
  const { to, url } = options;

  const html = `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>E-Mail bestätigen</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="padding:32px 40px 24px;text-align:center;border-bottom:1px solid #e4e4e7;">
              <h1 style="margin:0;font-size:22px;font-weight:700;color:#18181b;letter-spacing:-0.02em;">ZunftGewerk</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">
              <h2 style="margin:0 0 8px;font-size:20px;font-weight:600;color:#18181b;">E-Mail-Adresse bestätigen</h2>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#52525b;">
                Vielen Dank für Ihre Registrierung bei ZunftGewerk. Bitte klicken Sie auf den Button unten, um Ihre E-Mail-Adresse zu bestätigen und Ihr Konto zu aktivieren.
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 24px;">
                <tr>
                  <td style="border-radius:8px;background-color:#18181b;">
                    <a href="${url}" target="_blank" style="display:inline-block;padding:12px 32px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;">
                      E-Mail bestätigen
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 16px;font-size:13px;line-height:1.5;color:#71717a;">
                Oder kopieren Sie diesen Link in Ihren Browser:
              </p>
              <p style="margin:0 0 24px;font-size:13px;line-height:1.5;color:#3b82f6;word-break:break-all;">
                ${url}
              </p>
              <p style="margin:0;font-size:13px;line-height:1.5;color:#a1a1aa;">
                Dieser Link ist 24 Stunden gültig. Falls Sie sich nicht bei ZunftGewerk registriert haben, können Sie diese E-Mail ignorieren.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #e4e4e7;text-align:center;">
              <p style="margin:0;font-size:12px;color:#a1a1aa;">
                &copy; ${new Date().getFullYear()} ZunftGewerk. Alle Rechte vorbehalten.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();

  const text = [
    'E-Mail-Adresse bestätigen',
    '',
    'Vielen Dank für Ihre Registrierung bei ZunftGewerk.',
    'Bitte öffnen Sie den folgenden Link, um Ihre E-Mail-Adresse zu bestätigen:',
    '',
    url,
    '',
    'Dieser Link ist 24 Stunden gültig.',
    'Falls Sie sich nicht bei ZunftGewerk registriert haben, können Sie diese E-Mail ignorieren.',
  ].join('\n');

  await sendEmail({
    to,
    subject: 'E-Mail-Adresse bestätigen – ZunftGewerk',
    html,
    text,
  });
}
