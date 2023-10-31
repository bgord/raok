import * as VO from "../value-objects";
import * as Repos from "../repositories";

export class Source {
  constructor(private data: VO.SourceType) {}

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

    await Repos.SourceRepository.archive({ id: this.data.id });
  }

  async delete() {
    if (this.data.status === VO.SourceStatusEnum.deleted) {
      throw new Error("Source already deleted");
    }

    await Repos.SourceRepository.delete({ id: this.data.id });
  }

  static async create(payload: Pick<VO.SourceType, "url" | "id">) {
    const now = Date.now();

    await Repos.SourceRepository.create({
      ...payload,
      createdAt: now,
      updatedAt: now,
      status: VO.SourceStatusEnum.active,
    });
  }

  static async build(id: VO.SourceIdType) {
    const source = await Repos.SourceRepository.getById({ id });

    if (!source) throw new Error("Source not found");

    return new Source(VO.Source.parse(source));
  }
}
