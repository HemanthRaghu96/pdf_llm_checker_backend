import { Request, Response } from "express";
import { CheckResultsService } from "./checkResults.service";
import type { CheckResultsRequest } from "./ICheckResults";
import { PDFParse } from "pdf-parse"; 

export class CheckResultsController {
  private checkResultsService: CheckResultsService;

  constructor() {
    this.checkResultsService = new CheckResultsService();
  }

  checkDocument = async (req: Request, res: Response): Promise<void> => {
    try {
      const file = (req as any).file;

      if (!file) {
        res.status(400).json({ error: "No PDF file uploaded" });
        return;
      }

      if (!req.body.rules) {
        res.status(400).json({ error: "No rules provided" });
        return;
      }

      // Extract text from PDF
      const pdfText = await this.parsePDF(file.buffer);
      console.log("Extracted PDF Text:", pdfText);

      if (!pdfText || pdfText.trim().length === 0) {
        res.status(400).json({
          error: "PDF appears to be empty or contains no extractable text",
        });
        return;
      }

      // Parse rules from body
      let rules: string[];
      try {
        rules = JSON.parse(req.body.rules);
      } catch {
        rules = Array.isArray(req.body.rules)
          ? req.body.rules
          : [req.body.rules];
      }

      if (!Array.isArray(rules) || rules.length === 0) {
        res.status(400).json({ error: "Rules must be a non-empty array" });
        return;
      }

      const request: CheckResultsRequest = {
        pdfText,
        rules,
      };

      const result = await this.checkResultsService.checkRules(request);
      res.json(result);
    } catch (error) {
      console.error("Error in checkDocument:", error);
      res.status(500).json({
        error: (error as Error).message || "Internal server error",
      });
    }
  };

  // ------- PDF PARSER (pdf-parse ONLY) -------
  private async parsePDF(pdfBuffer: Buffer): Promise<string> {
    try {
      const uint8 = new Uint8Array(pdfBuffer); // <-- IMPORTANT FIX

      const data = new PDFParse(uint8);

      console.log("pdf-parse result:", (await data.getText()).text);
      return (await data.getText()).text || "";
    } catch (error) {
      console.error("pdf-parse failed:", error);
      throw new Error("Failed to extract text from PDF");
    }
  }

  getHistory = async (req: Request, res: Response): Promise<void> => {
    try {
      const results = await this.checkResultsService.getHistoricalResults();
      res.json(results);
    } catch (error) {
      console.error("Error getting history:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}
