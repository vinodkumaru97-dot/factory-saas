import { Request, Response } from "express";
import { prisma } from "../../config/prisma";

interface BatchRMInput {
  rm_id: number;
  qty_used: number;
}

export async function createBatch(req: Request, res: Response) {
  const {
    batch_code,
    batch_date,
    product_id,
    expected_output_qty,
    actual_output_qty,
    byproduct_qty,
    operator_name,
    remarks,
    raw_materials
  } = req.body as {
    batch_code: string;
    batch_date: string;
    product_id: number;
    expected_output_qty?: number;
    actual_output_qty?: number;
    byproduct_qty?: number;
    operator_name?: string;
    remarks?: string;
    raw_materials: BatchRMInput[];
  };

  if (!batch_code || !batch_date || !product_id || !raw_materials?.length) {
    return res
      .status(400)
      .json({ message: "Missing batch fields or raw materials" });
  }

  const yield_pct =
    expected_output_qty && actual_output_qty
      ? (actual_output_qty / expected_output_qty) * 100
      : null;

  const result = await prisma.$transaction(async (tx) => {
    const batch = await tx.batch.create({
      data: {
        batch_code,
        batch_date: new Date(batch_date),
        product_id,
        expected_output_qty: expected_output_qty ?? null,
        actual_output_qty: actual_output_qty ?? null,
        byproduct_qty: byproduct_qty ?? null,
        yield_pct: yield_pct ?? null,
        operator_name: operator_name ?? null,
        remarks: remarks ?? null
      }
    });

    for (const rm of raw_materials) {
      await tx.batchRawMaterial.create({
        data: {
          batch_id: batch.batch_id,
          rm_id: rm.rm_id,
          qty_used: rm.qty_used
        }
      });

      await tx.rMStockMovement.create({
        data: {
          txn_date: new Date(batch_date),
          rm_id: rm.rm_id,
          txn_type: "OUT",
          qty_in: 0,
          qty_out: rm.qty_used,
          rate_per_unit: null,
          total_amount: null,
          reference_type: "BATCH",
          reference_id: batch.batch_id
        }
      });
    }

    return batch;
  });

  res.status(201).json(result);
}


