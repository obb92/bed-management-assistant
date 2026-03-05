
import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/chat", async (req, res) => {
    const { messages, systemPrompt } = req.body;
    const apiKey = process.env.VITE_ANTHROPIC_API_KEY;

    if (!apiKey) {
      return res.status(400).json({ error: "VITE_ANTHROPIC_API_KEY not configured in Replit Secrets." });
    }

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-5",
          max_tokens: 512,
          system: systemPrompt,
          messages,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        return res.status(response.status).json({ error: errText });
      }

      const data = await response.json();
      const text = data.content?.[0]?.text ?? "";
      res.json({ text });
    } catch (err: any) {
      res.status(500).json({ error: err.message ?? "Unknown error" });
    }
  });

  return httpServer;
}
