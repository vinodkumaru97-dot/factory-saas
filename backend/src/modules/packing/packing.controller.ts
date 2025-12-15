import { Request, Response } from "express";
import { prisma } from "../../config/prisma";

export async function createPacking(req: Request, res: Response) {
  const {
    packing_date,
    batch_id,
    product_id,
    pack_size,
    pack_unit,
    no_of_packs,
    total_qty_packed,
    remarks
  } = req.body as {
    packing_date: string;
    batch_id: number;
    product_id: number;
    pack_size: number;
    pack_unit: string;
    no_of_packs: number;
    total_qty_packed: number;
    remarks?: string;
  };

  if (
    !packing_date ||
    !batch_id ||
    !product_id ||
    !pack_size ||
    !pack_unit ||
    !no_of_packs ||
    !total_qty_packed
  ) {
    return res.status(400).json({ message: "Missing packing fields" });
  }

  const result = await prisma.$transaction(async (tx) => {
    const packing = await tx.packing.create({
      data: {
        packing_date: new Date(packing_date),
        batch_id,
        product_id,
        pack_size,
        pack_unit,
        no_of_packs,
        total_qty_packed,
        remarks: remarks ?? null
      }
    });

    await tx.fGStockMovement.create({
      data: {
        movement_date: new Date(packing_date),
        product_id,
        pack_size,
        pack_unit,
        txn_type: "IN",
        qty_packs_in: no_of_packs,
        qty_packs_out: 0,
        reference_type: "PACKING",
        reference_id: packing.packing_id,
        remarks: remarks ?? null
      }
    });

    return packing;
  });

  res.status(201).json(result);
}


