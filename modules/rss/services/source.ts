import * as bg from "@bgord/node";

import * as VO from "../value-objects";
import * as Repos from "../repositories";
import * as Policies from "../policies";
import { SourceFinder } from "./source-finder";

export class Source {
  private constructor(readonly data: VO.SourceType) {}

  async archive(revision: bg.Revision) {
    revision.validate(this.data.revision);

    if (this.data.status === VO.SourceStatusEnum.inactive) {
      throw new Error("Source already archived");
    }

    if (this.data.status === VO.SourceStatusEnum.deleted) {
      throw new Error("Source is deleted");
    }

    await Repos.SourceRepository.archive({
      id: this.data.id,
      revision: revision.next().value,
    });
  }

  async reactivate(revision: bg.Revision) {
    revision.validate(this.data.revision);

    if (this.data.status === VO.SourceStatusEnum.active) {
      throw new Error("Source already active");
    }

    if (this.data.status === VO.SourceStatusEnum.deleted) {
      throw new Error("Source is deleted");
    }

    await Repos.SourceRepository.reactivate({
      id: this.data.id,
      revision: revision.next().value,
    });
  }

  async delete(revision: bg.Revision) {
    revision.validate(this.data.revision);

    if (this.data.status === VO.SourceStatusEnum.deleted) {
      throw new Error("Source already deleted");
    }

    await Repos.SourceRepository.delete({
      id: this.data.id,
      revision: revision.next().value,
    });
  }

  async bump(revision: bg.Revision) {
    revision.validate(this.data.revision);

    if (this.data.status !== VO.SourceStatusEnum.active) {
      throw new Error("Source is not active");
    }

    await Repos.SourceRepository.bump({
      id: this.data.id,
      revision: revision.next().value,
    });
  }

  static async create(
    payload: Pick<VO.SourceType, "url" | "id">
  ): Promise<Source> {
    const now = Date.now();

    const sourceFinder = await SourceFinder.build(payload.url);
    const url = await sourceFinder.find();

    await Policies.SourceUrlIsUnique.perform({ sourceUrl: url });

    const source = {
      id: payload.id,
      url,
      createdAt: BigInt(now),
      updatedAt: BigInt(now),
      status: VO.SourceStatusEnum.active,
      revision: bg.Revision.initial,
      countValue: 0,
      countStrategy: "total_last_month",
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
