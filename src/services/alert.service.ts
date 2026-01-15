import EulerStreamApiClient from '@eulerstream/euler-api-sdk';

export class AlertService {
  private client: EulerStreamApiClient;
  private accountId: string;

  constructor() {
    if (!process.env.EULER_ACCOUNT_API_KEY) {
      throw new Error('EULER_ACCOUNT_API_KEY is required');
    }
    if (!process.env.EULER_ACCOUNT_ID) {
      throw new Error('EULER_ACCOUNT_ID is required');
    }

    this.accountId = process.env.EULER_ACCOUNT_ID;
    this.client = new EulerStreamApiClient({
      apiKey: process.env.EULER_ACCOUNT_API_KEY,
    });
  }

  async createAlert(uniqueId: string) {
    return this.client.alerts.createAlert(Number(this.accountId), {
      unique_id: uniqueId,
    });
  }

  async deleteAlert(alertId: number) {
    return this.client.alerts.deleteAlert(Number(this.accountId), alertId);
  }

  async listAlerts() {
    return this.client.alerts.listAlerts(Number(this.accountId));
  }

  async createWebhook(alertId: number, webhookUrl: string, metadata?: object) {
    return this.client.alertTargets.createAlertTarget(
      Number(this.accountId),
      alertId,
      {
        url: webhookUrl,
        metadata,
      }
    );
  }

  async deleteWebhook(alertId: number, targetId: number) {
    return this.client.alertTargets.deleteAlertTarget(
      Number(this.accountId),
      alertId,
      targetId
    );
  }

  async listWebhooks(alertId: number) {
    return this.client.alertTargets.listAlertTargets(
      Number(this.accountId),
      alertId
    );
  }
}
