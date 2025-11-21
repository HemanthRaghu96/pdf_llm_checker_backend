import type {
  RuleCheckRequest,
  RuleCheckResponse,
  CheckResultsRequest,
  CheckResultsResponse,
} from "../checkResults/ICheckResults";

export class MockCheckResultsService {
  async checkRules(
    request: CheckResultsRequest
  ): Promise<CheckResultsResponse> {
    console.log("Using Mock Service - Simulating rule checks");
    const results: RuleCheckResponse[] = [];

    for (const rule of request.rules) {
      const result = await this.mockCheckSingleRule(rule, request.pdfText);
      results.push(result);
    }

    return { results };
  }

  private async mockCheckSingleRule(
    rule: string,
    text: string
  ): Promise<RuleCheckResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simple mock logic based on text content and rule keywords
    const lowerText = text.toLowerCase();
    const lowerRule = rule.toLowerCase();

    // Check for common patterns in the text
    const hasDate =
      /\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2}|january|february|march|april|may|june|july|august|september|october|november|december/i.test(
        text
      );
    const hasPurpose = /purpose|objective|goal|aim|intent/i.test(lowerText);
    const hasDefinition = /define|definition|means|refers to|is defined/i.test(
      lowerText
    );
    const hasResponsible =
      /responsible|accountable|duty|obligation|shall|must/i.test(lowerText);
    const hasRequirements = /requirement|must|shall|should|required|need/i.test(
      lowerText
    );
    const hasContact = /contact|email|phone|address|@|\.com|\.org/i.test(
      lowerText
    );
    const hasTerminology = /term|definition|glossary|means/i.test(lowerText);

    // Determine result based on rule content and text analysis
    let status: "pass" | "fail" = "fail";
    let evidence = "No matching evidence found in document";
    let reasoning = "Rule condition not met based on document analysis";
    let confidence = 0;

    // Rule-based matching
    if (lowerRule.includes("date") && hasDate) {
      status = "pass";
      evidence = "Document contains date references";
      reasoning = "Found date patterns in the document text";
      confidence = 85;
    } else if (
      (lowerRule.includes("purpose") || lowerRule.includes("objective")) &&
      hasPurpose
    ) {
      status = "pass";
      evidence = "Document mentions purpose or objectives";
      reasoning = "Found purpose-related terminology in document";
      confidence = 80;
    } else if (
      (lowerRule.includes("define") || lowerRule.includes("definition")) &&
      hasDefinition
    ) {
      status = "pass";
      evidence = "Document contains definition sections or terminology";
      reasoning = "Found definition patterns in document text";
      confidence = 75;
    } else if (
      (lowerRule.includes("responsible") ||
        lowerRule.includes("accountable")) &&
      hasResponsible
    ) {
      status = "pass";
      evidence = "Document mentions responsibilities or obligations";
      reasoning = "Found responsibility-related terms in document";
      confidence = 70;
    } else if (
      (lowerRule.includes("requirement") ||
        lowerRule.includes("must") ||
        lowerRule.includes("shall")) &&
      hasRequirements
    ) {
      status = "pass";
      evidence = "Document lists requirements or mandatory items";
      reasoning = "Found requirement-related terminology";
      confidence = 78;
    } else if (lowerRule.includes("contact") && hasContact) {
      status = "pass";
      evidence = "Document contains contact information";
      reasoning = "Found contact details or email patterns";
      confidence = 90;
    } else if (lowerRule.includes("term") && hasTerminology) {
      status = "pass";
      evidence = "Document includes terminology or definitions";
      reasoning = "Found terminology sections in document";
      confidence = 72;
    } else {
      // Random pass for demonstration (30% chance)
      const randomPass = Math.random() < 0.3;
      if (randomPass) {
        status = "pass";
        evidence = "Simulated positive match for demonstration";
        reasoning = "Mock service generated positive result for testing";
        confidence = Math.floor(Math.random() * 30) + 70; // 70-100
      } else {
        status = "fail";
        evidence = "No evidence found for this rule";
        reasoning = "Rule condition not satisfied based on document content";
        confidence = Math.floor(Math.random() * 40); // 0-40
      }
    }

    return {
      rule,
      status,
      evidence,
      reasoning,
      confidence,
    };
  }

  async getHistoricalResults() {
    // Return empty array for mock service
    return [];
  }
}
