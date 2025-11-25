declare module 'sib-api-v3-sdk' {
  // Minimal Brevo (Sendinblue) typings required by our email service
  namespace BrevoSdk {
    const ApiClient: {
      instance: any;
      authentications: Record<string, { apiKey?: string }>;
    };

    class TransactionalEmailsApi {
      sendTransacEmail(payload: any): Promise<any>;
    }
  }

  export default BrevoSdk;
}
