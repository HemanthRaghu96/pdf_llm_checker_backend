import { AppDataSource } from "../config/data-source";
import { CheckResults } from "../checkResults/checkResults.entity";
import type { RuleCheckResponse } from "../checkResults/ICheckResults";

export class CheckResultsDAO {
  private checkResultsRepository = AppDataSource.getRepository(CheckResults);

  async saveCheckResults(
    pdfText: string,
    rules: string[],
    results: RuleCheckResponse[]
  ): Promise<CheckResults> {
    const checkResults = new CheckResults();
    checkResults.pdf_text = pdfText;
    checkResults.rules = rules;
    checkResults.results = results;

    return await this.checkResultsRepository.save(checkResults);
  }

  async getCheckResultsById(id: string): Promise<CheckResults | null> {
    return await this.checkResultsRepository.findOne({ where: { id } });
  }

  async getAllCheckResults(): Promise<CheckResults[]> {
    return await this.checkResultsRepository.find({
      order: { created_at: "DESC" },
    });
  }
}
