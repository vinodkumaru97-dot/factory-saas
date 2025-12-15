import { Request, Response } from "express";
import { prisma } from "../../config/prisma";

interface DispatchItem {
  product_id: number;
  pack_size: number;
  pack_unit: string;
  qty_packs: number;
}

export async function createDispatch(req: Request, res: Response) {
  const {
    dispatch_no,
    dispatch_date,
    order_id,
    customer_id,
    transport_details,
    status,
    remarks,
    items
  } = req.body as {
    dispatch_no: string;
    dispatch_date: string;
    order_id?: number;
    customer_id: number;
    transport_details?: string;
    status?: string;
    remarks?: string;
    items: DispatchItem[];
  };

  if (!dispatch_no || !dispatch_date || !customer_id || !items?.length) {
    return res
      .status(400)
      .json({ message: "Missing dispatch fields or items" });
  }

  const result = await prisma.$transaction(async (tx) => {
    const dispatch = await tx.dispatch.create({
      data: {
        dispatch_no,
        dispatch_date: new Date(dispatch_date),
        order_id: order_id ?? null,
        customer_id,
        transport_details: transport_details ?? null,
        status: status ?? "DISPATCHED",
        remarks: remarks ?? null
      }
    });

    for (const item of items) {
      await tx.fGStockMovement.create({
        data: {
          movement_date: new Date(dispatch_date),
          product_id: item.product_id,
          pack_size: item.pack_size,
          pack_unit: item.pack_unit,
          txn_type: "OUT",
          qty_packs_in: 0,
          qty_packs_out: item.qty_packs,
          reference_type: "DISPATCH",
          reference_id: dispatch.dispatch_id,
          remarks: remarks ?? null
        }
      });
    }

    return dispatch;
  });

  res.status(201).json(result);
}


