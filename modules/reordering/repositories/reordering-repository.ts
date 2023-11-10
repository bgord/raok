import * as bg from "@bgord/node";

import * as infra from "../../../infra";

export class ReorderingRepository {
  static async addItem(data: bg.Schema.ReorderingType) {
    return infra.db.reordering.create({ data });
  }

  static async deleteItem(payload: Pick<bg.Schema.ReorderingType, "id">) {
    return infra.db.reordering.delete({ where: { id: payload.id } });
  }

  static async updateItem(
    payload: Pick<bg.Schema.ReorderingType, "id" | "position">
  ) {
    return infra.db.reordering.update({
      where: { id: payload.id },
      data: { position: payload.position },
    });
  }

  static async list(correlationId: bg.Schema.ReorderingType["correlationId"]) {
    return infra.db.reordering.findMany({
      where: { correlationId },
      orderBy: { position: "asc" },
    });
  }
}
