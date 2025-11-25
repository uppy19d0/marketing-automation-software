import Brevo from 'sib-api-v3-sdk';

const brevoApiKey = process.env.BREVO_API_KEY;
const senderEmail = process.env.BREVO_SENDER_EMAIL || process.env.SMTP_USER;
const senderName = process.env.BREVO_SENDER_NAME || 'Marketing Automation';

const brevoClient = Brevo.ApiClient.instance;
if (brevoApiKey) {
  const apiKeyAuth = brevoClient.authentications['api-key'];
  apiKeyAuth.apiKey = brevoApiKey;
} else {
  console.warn('[Email] BREVO_API_KEY not configured. Email sending is disabled.');
}

if (!senderEmail) {
  console.warn('[Email] BREVO_SENDER_EMAIL (or SMTP_USER) not configured. Emails will fail to send.');
}

const brevoTransactional = new Brevo.TransactionalEmailsApi();

export async function sendEmail(to: string, subject: string, html: string) {
  if (!brevoApiKey || !senderEmail) {
    console.warn('[Email] Tried to send email but required Brevo env vars are missing.');
    return;
  }

  try {
    await brevoTransactional.sendTransacEmail({
      to: [{ email: to }],
      subject,
      htmlContent: html,
      sender: {
        email: senderEmail,
        name: senderName,
      },
    });
  } catch (error: any) {
    console.error('[Email] Error sending via Brevo:', error?.message || error);
    throw error;
  }
}
