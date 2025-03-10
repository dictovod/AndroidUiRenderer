import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express) {
  app.post("/api/parse-xml", async (req, res) => {
    const schema = z.object({
      xmlContent: z.string().min(1),
    });

    try {
      const { xmlContent } = schema.parse(req.body);
      const result = await storage.parseAndStoreXml(xmlContent);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
