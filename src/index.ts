import "dotenv/config";
import express, { Request, Response } from "express";
import { createWebhookRouter } from "./routes/webhook.routes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/webhooks", createWebhookRouter());

app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
