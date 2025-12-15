import { Request, Response } from "express";
import { prisma } from "../../config/prisma";

export async function createReturn(req: Request, res: Response) {
  const {
    return_date,
    source_type,
    source_ref,
    product_id,
    pack_size,
    pack_unit,
    qty_packs,
    reason,
    adjusted_in_stock,
    remarks
  } = req.body as {
    return_date: string;
    source_type: string;
    source_ref?: string;
    product_id: number;
    pack_size: number;
    pack_unit: string;
    qty_packs: number;
    reason?: string;
    adjusted_in_stock?: boolean;
    remarks?: string;
  };

  if (
    !return_date ||
    !source_type ||
    !product_id ||
    !pack_size ||
    !pack_unit ||
    !qty_packs
  ) {
    return res.status(400).json({ message: "Missing return fields" });
  }

  const result = await prisma.$transaction(async (tx) => {
    const ret = await tx.return.create({
      data: {
        return_date: new Date(return_date),
        source_type,
        source_ref: source_ref ?? null,
        product_id,
        pack_size,
        pack_unit,
        qty_packs,
        reason: reason ?? null,
        adjusted_in_stock: adjusted_in_stock ?? false,
        remarks: remarks ?? null
      }
    });

    if (adjusted_in_stock) {
      await tx.fGStockMovement.create({
        data: {
          movement_date: new Date(return_date),
          product_id,
          pack_size,
          pack_unit,
          txn_type: "IN",
          qty_packs_in: qty_packs,
          qty_packs_out: 0,
          reference_type: "RETURN",
          reference_id: ret.return_id,
          remarks: remarks ?? reason ?? null
        }
      });
    }

    return ret;
  });

  res.status(201).json(result);
}


