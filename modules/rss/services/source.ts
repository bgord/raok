import * as VO from "../value-objects";
import * as Repos from "../repositories";
import * as Policies from "../policies";
import { SourceFinder } from "./source-finder";

export class Source {
  private constructor(private readonly data: VO.SourceType) {}

  async archive() {
    if (this.data.status === VO.SourceStatusEnum.inactive) {
      throw new Error("Source already archived");
    }

    if (this.data.status === VO.SourceStatusEnum.deleted) {
      throw new Error("Source is deleted");
    }

    await Repos.SourceRepository.archive({ id: this.data.id });
  }

  async reactivate() {
    if (this.data.status === VO.SourceStatusEnum.active) {
      throw new Error("Source already active");
    }

    if (this.data.status === VO.SourceStatusEnum.deleted) {
      throw new Error("Source is deleted");
    }

    await Repos.SourceRepository.reactivate({ id: this.data.id });
  }

  async delete() {
    if (this.data.status === VO.SourceStatusEnum.deleted) {
      throw new Error("Source already deleted");
    }

    await Repos.SourceRepository.delete({ id: this.data.id });
  }

  static async create(
    payload: Pick<VO.SourceType, "url" | "id">
  ): Promise<Source> {
    await Policies.SourceUrlIsUnique.perform({ sourceUrl: payload.url });

    const url = await new SourceFinder(payload.url).find();
    const now = Date.now();

    const source = {
      id: payload.id,
      url,
      createdAt: now,
      updatedAt: now,
      status: VO.SourceStatusEnum.active,
    };

    await Repos.SourceRepository.create(source);

    return new Source(source);
  }

  static async build(id: VO.SourceIdType): Promise<Source> {
    const source = await Repos.SourceRepository.getById({ id });

    if (!source) throw new Error("Source not found");

    return new Source(VO.Source.parse(source));
  }
}
