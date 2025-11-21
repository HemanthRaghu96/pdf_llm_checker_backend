import { GoogleGenerativeAI } from "@google/generative-ai";
import { CheckResultsDAO } from "../checkResults/checkResults.dao";
import type {
  RuleCheckRequest,
  RuleCheckResponse,
  CheckResultsRequest,
  CheckResultsResponse,
} from "../checkResults/ICheckResults";
import { GeminiConfig } from "../config/gemini";
import { MockCheckResultsService } from "./mockCheckResults.service";

export class CheckResultsService {
  private checkResultsDAO: CheckResultsDAO;
  private mockService: MockCheckResultsService;

  // Initialize genAI only when needed
  private getGenAI(): GoogleGenerativeAI | null {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_actual_gemini_api_key_here") {
      return null;
    }
    return new GoogleGenerativeAI(apiKey);
  }

  constructor() {
    this.checkResultsDAO = new CheckResultsDAO();
    this.mockService = new MockCheckResultsService();

    const genAI = this.getGenAI();
    if (genAI) {
      console.log("🔧 Using REAL Gemini service");
    } else {
      console.log("🔧 Using MOCK service - Gemini API key not configured");
    }
  }

  async checkRules(
    request: CheckResultsRequest
  ): Promise<CheckResultsResponse> {
    const genAI = this.getGenAI();

    if (!genAI) {
      return await this.mockService.checkRules(request);
    }

    // Try real Gemini service with fallback to mock
    try {
      const results = await this.tryRealGeminiService(request, genAI);
      await this.checkResultsDAO.saveCheckResults(
        request.pdfText,
        request.rules,
        results
      );
      return { results };
    } catch (error) {
      console.error("Gemini API failed, falling back to mock service:", error);
      return await this.mockService.checkRules(request);
    }
  }

  private async tryRealGeminiService(
    request: CheckResultsRequest,
    genAI: GoogleGenerativeAI
  ): Promise<RuleCheckResponse[]> {
    const results: RuleCheckResponse[] = [];
    const models = ["gemini-2.5-flash", "gemini-1.0-pro-latest", "gemini-pro"];

    for (const rule of request.rules) {
      let success = false;

      for (const modelName of models) {
        try {
          console.log(`Trying model: ${modelName} for rule: ${rule}`);
          const result = await this.checkSingleRuleWithModel(
            rule,
            request.pdfText,
            modelName,
            genAI
          );
          results.push(result);
          success = true;
          console.log(`✅ Success with model: ${modelName}`);
          break;
        } catch (error) {
          console.log(
            `❌ Model ${modelName} failed:`,
            (error as Error).message
          );
          continue;
        }
      }

      if (!success) {
        throw new Error(`All models failed for rule: ${rule}`);
      }
    }

    return results;
  }

  private async checkSingleRuleWithModel(
    rule: string,
    text: string,
    modelName: string,
    genAI: GoogleGenerativeAI
  ): Promise<RuleCheckResponse> {
    const model = genAI.getGenerativeModel({ model: modelName });
    console.log("text", text);
    const prompt = `
You are an AI system that checks whether a rule is satisfied by a document.

RULE:
"${rule}"

DOCUMENT (Text Extracted from PDF):
"${text.substring(0, 12000)}"

TASK:
Evaluate the rule ONLY using the given document text. If information is not present, mark as FAIL.

Return output STRICTLY as valid JSON with this schema:

{
  "status": "pass" or "fail",
  "evidence": "exact sentence or phrase from the document, or empty string if none",
  "reasoning": "short explanation (1–2 lines)",
  "confidence": number between 0 and 100
}

STRICT REQUIREMENTS:
- Return ONLY valid JSON. No Markdown, no commentary, no surrounding text.
- "evidence" MUST be copied verbatim from the document when possible.
- If unsure or document does not clearly satisfy rule → status = "fail" and evidence = "".
- Confidence = level of certainty based on document clarity.
- Do NOT invent text.

Now return the JSON response:
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid response format from LLM");
    }

    const parsedResult = JSON.parse(jsonMatch[0]);
    console.log("Parsed Result:", parsedResult);
    return {
      rule,
      status: parsedResult.status,
      evidence: parsedResult.evidence,
      reasoning: parsedResult.reasoning,
      confidence: parsedResult.confidence,
    };
  }

  async getHistoricalResults() {
    return await this.checkResultsDAO.getAllCheckResults();
  }
}
