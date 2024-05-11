import * as bg from "@bgord/node";
import { pipeline, SummarizationPipelineType } from "@xenova/transformers";

export class SummaryCreator {
  private constructor(
    private readonly summarization: SummarizationPipelineType,
  ) {}

  static async build() {
    const summarization = await pipeline(
      "summarization",
      "Xenova/distilbart-cnn-6-6",
    );

    return new SummaryCreator(summarization);
  }

  async summarize(text: bg.Falsy<string>): Promise<string | null> {
    if (!text) return null;

    const result = await this.summarization(text);

    // @ts-ignore
    return result[0]?.summary_text ?? null;
  }
}
