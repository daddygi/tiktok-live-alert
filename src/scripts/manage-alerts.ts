import 'dotenv/config';
import crypto from 'crypto';
import { AlertService } from '../services/alert.service';

const alertService = new AlertService();

async function main() {
  const command = process.argv[2];
  const arg1 = process.argv[3];
  const arg2 = process.argv[4];
  const arg3 = process.argv[5];

  try {
    switch (command) {
      case 'list':
        const alerts = await alertService.listAlerts();
        console.log('Alerts:', JSON.stringify(alerts.data, null, 2));
        break;

      case 'create':
        if (!arg1) {
          console.error('Usage: npm run manage-alerts create <tiktok_username>');
          process.exit(1);
        }
        const alert = await alertService.createAlert(arg1);
        console.log('Alert created:', JSON.stringify(alert.data, null, 2));
        break;

      case 'delete':
        if (!arg1) {
          console.error('Usage: npm run manage-alerts delete <alert_id>');
          process.exit(1);
        }
        await alertService.deleteAlert(Number(arg1));
        console.log('Alert deleted successfully');
        break;

      case 'create-webhook':
        if (!arg1 || !arg2) {
          console.error(
            'Usage: npm run manage-alerts create-webhook <alert_id> <webhook_url>'
          );
          process.exit(1);
        }
        const webhook = await alertService.createWebhook(
          Number(arg1),
          arg2,
          arg3 ? JSON.parse(arg3) : undefined
        );
        console.log('Webhook created:', JSON.stringify(webhook.data, null, 2));
        break;

      case 'list-webhooks':
        if (!arg1) {
          console.error('Usage: npm run manage-alerts list-webhooks <alert_id>');
          process.exit(1);
        }
        const webhooks = await alertService.listWebhooks(Number(arg1));
        console.log('Webhooks:', JSON.stringify(webhooks.data, null, 2));
        break;

      case 'delete-webhook':
        if (!arg1 || !arg2) {
          console.error(
            'Usage: npm run manage-alerts delete-webhook <alert_id> <webhook_id>'
          );
          process.exit(1);
        }
        await alertService.deleteWebhook(Number(arg1), Number(arg2));
        console.log('Webhook deleted successfully');
        break;

      case 'test':
        const webhookUrl = arg1 || 'http://localhost:3000/webhooks/tiktok-live-alert';
        const testPayload = {
          event: 'live.started',
          creator: {
            unique_id: 'test_user',
            nickname: 'Test User',
          },
          room: {
            id: '12345',
            title: 'Test Live Stream',
          },
          timestamp: new Date().toISOString(),
        };

        const body = JSON.stringify(testPayload);
        const signature = crypto
          .createHmac('sha256', process.env.EULER_WEBHOOK_SECRET!)
          .update(body)
          .digest('hex');

        console.log('Testing webhook:', webhookUrl);
        console.log('Payload:', testPayload);
        console.log('Signature:', signature);
        console.log('\nSending request...\n');

        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-webhook-signature': signature,
          },
          body,
        });

        const result = await response.text();
        console.log('Response status:', response.status);
        console.log('Response body:', result);

        if (response.ok) {
          console.log('\n✓ Webhook test successful!');
        } else {
          console.log('\n✗ Webhook test failed!');
        }
        break;

      default:
        console.log(`
TikTok Alert Management Commands:

  list                                          - List all alerts
  create <tiktok_username>                      - Create alert for TikTok user
  delete <alert_id>                             - Delete an alert
  create-webhook <alert_id> <webhook_url>       - Create webhook for alert
  list-webhooks <alert_id>                      - List webhooks for alert
  delete-webhook <alert_id> <webhook_id>        - Delete a webhook
  test [webhook_url]                            - Test webhook with sample data (default: localhost:3000)
        `);
    }
  } catch (error: any) {
    console.error('Error:', error.response?.data || error.message);
    process.exit(1);
  }
}

main();
