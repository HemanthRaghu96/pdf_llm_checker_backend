export interface RuleCheckRequest {
  rule: string;
  text: string;
}

export interface RuleCheckResponse {
  rule: string;
  status: "pass" | "fail";
  evidence: string;
  reasoning: string;
  confidence: number;
}

export interface CheckResultsRequest {
  pdfText: string;
  rules: string[];
}

export interface CheckResultsResponse {
  results: RuleCheckResponse[];
}
