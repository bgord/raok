import * as bg from "@bgord/node";
import express from "express";

import * as Services from "../services";

export async function ReorderingTransfer(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const correlationId = bg.Schema.ReorderingCorrelationId.parse(
    request.params.correlationId
  );
  const id = bg.Schema.ReorderingItemId.parse(request.body.id);
  const to = bg.Schema.ReorderingItemPositionValue.parse(
    Number(request.body.to)
  );

  const transfer = new bg.ReorderingTransfer({ id, to });
  await Services.Reordering.transfer(correlationId, transfer);

  return response.status(200).send();
}
