const brevoApiKey = process.env.BREVO_API_KEY;
const senderEmail = process.env.BREVO_SENDER_EMAIL || process.env.SMTP_USER;
const senderName = process.env.BREVO_SENDER_NAME || 'Marketing Automation';

if (!brevoApiKey) {
  console.warn('[Email] BREVO_API_KEY not configured. Email sending is disabled.');
}

if (!senderEmail) {
  console.warn('[Email] BREVO_SENDER_EMAIL (or SMTP_USER) not configured. Emails will fail to send.');
}

export async function sendEmail(to: string, subject: string, html: string) {
  if (!brevoApiKey || !senderEmail) {
    console.warn('[Email] Tried to send email but required Brevo env vars are missing.');
    return;
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': brevoApiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: senderName,
          email: senderEmail,
        },
        to: [
          {
            email: to,
          },
        ],
        subject: subject,
        htmlContent: html,
      }),
    });

    if (!response.ok) {
      const errorData: any = await response.json().catch(() => ({}));
      throw new Error(
        `Brevo API error: ${response.status} - ${errorData.message || response.statusText}`
      );
    }

    const data = await response.json();
    console.log('[Email] Email sent successfully to:', to);
    return data;
  } catch (error: any) {
    console.error('[Email] Error sending via Brevo:', error?.message || error);
    throw error;
  }
}
