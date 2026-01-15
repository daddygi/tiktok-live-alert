import { Router, Request, Response } from 'express';
import express from 'express';
import { WebhookValidator } from '../utils/webhook-validator';

export const createWebhookRouter = () => {
  const router = Router();
  const validator = new WebhookValidator(process.env.EULER_WEBHOOK_SECRET!);

  router.post(
    '/tiktok-live-alert',
    express.raw({ type: 'application/json' }),
    (req: Request, res: Response) => {
      const signature = req.headers['x-webhook-signature'] as string;
      const rawBody = req.body.toString('utf-8');

      if (!signature) {
        return res.status(401).json({ error: 'Missing signature' });
      }

      if (!validator.validate(signature, rawBody)) {
        return res.status(401).json({ error: 'Invalid signature' });
      }

      const payload = JSON.parse(rawBody);
      console.log('TikTok Live Alert received:', payload);

      res.status(200).json({ received: true });
    }
  );

  return router;
};
