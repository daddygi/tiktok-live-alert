import crypto from 'crypto';

export class WebhookValidator {
  private secret: string;

  constructor(secret: string) {
    if (!secret) {
      throw new Error('Webhook secret is required');
    }
    this.secret = secret;
  }

  validate(signature: string, body: string): boolean {
    const expectedSignature = crypto
      .createHmac('sha256', this.secret)
      .update(body)
      .digest('hex');

    return signature === expectedSignature;
  }
}
