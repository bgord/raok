import * as bg from "@bgord/node";

import * as Repos from "../repositories";

export class Reordering {
  static async add(payload: Omit<bg.Schema.ReorderingType, "position">) {
    const list = await Repos.ReorderingRepository.list(payload.correlationId);

    const calculator = bg.ReorderingCalculator.fromArray(
      list.map((item) => item.id)
    );
    const item = calculator.add(payload.id);

    await Repos.ReorderingRepository.addItem({
      correlationId: payload.correlationId,
      id: item.id,
      position: item.position.value,
    });
  }

  static async delete(payload: Omit<bg.Schema.ReorderingType, "position">) {
    const list = await Repos.ReorderingRepository.list(payload.correlationId);

    const reordering = bg.ReorderingCalculator.fromArray(
      list.map((item) => item.id)
    );
    reordering.delete(payload.id);

    await Repos.ReorderingRepository.deleteItem({ id: payload.id });

    for (const item of reordering.read().items) {
      await Repos.ReorderingRepository.updateItem({
        id: item.id,
        position: item.position.value,
      });
    }
  }

  static async transfer(
    correlationId: bg.Schema.ReorderingType["correlationId"],
    transfer: bg.ReorderingTransfer
  ) {
    const list = await Repos.ReorderingRepository.list(correlationId);

    const reordering = bg.ReorderingCalculator.fromArray(
      list.map((item) => item.id)
    );
    reordering.transfer(transfer);

    for (const item of reordering.read().items) {
      await Repos.ReorderingRepository.updateItem({
        id: item.id,
        position: item.position.value,
      });
    }
  }
}
