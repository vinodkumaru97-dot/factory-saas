import { Request, Response } from "express";
import { prisma } from "../../config/prisma";
import { addDays } from "date-fns";

export async function rawMaterialStock(_req: Request, res: Response) {
  const movements = await prisma.rMStockMovement.groupBy({
    by: ["rm_id"],
    _sum: {
      qty_in: true,
      qty_out: true
    }
  });

  const rms = await prisma.rawMaterial.findMany({
    where: { rm_id: { in: movements.map((m) => m.rm_id) } }
  });

  const result = movements.map((m) => {
    const rm = rms.find((r) => r.rm_id === m.rm_id);
    const balance = (m._sum.qty_in || 0) - (m._sum.qty_out || 0);
    return {
      rm_id: m.rm_id,
      rm_name: rm?.rm_name,
      unit: rm?.unit,
      balance_qty: balance,
      min_stock_qty: rm?.min_stock_qty
    };
  });

  res.json(result);
}

export async function finishedGoodsStock(_req: Request, res: Response) {
  const moves = await prisma.fGStockMovement.groupBy({
    by: ["product_id", "pack_size", "pack_unit"],
    _sum: {
      qty_packs_in: true,
      qty_packs_out: true
    }
  });

  const products = await prisma.product.findMany({
    where: { product_id: { in: moves.map((m) => m.product_id) } }
  });

  const result = moves.map((m) => {
    const product = products.find((p) => p.product_id === m.product_id);
    const balance =
      (m._sum.qty_packs_in || 0) - (m._sum.qty_packs_out || 0);
    return {
      product_id: m.product_id,
      product_name: product?.product_name,
      pack_size: m.pack_size,
      pack_unit: m.pack_unit,
      balance_packs: balance
    };
  });

  res.json(result);
}

export async function batchYield(_req: Request, res: Response) {
  const batches = await prisma.batch.findMany({
    include: {
      product: true
    },
    orderBy: { batch_date: "desc" },
    take: 100
  });

  const result = batches.map((b) => ({
    batch_id: b.batch_id,
    batch_code: b.batch_code,
    batch_date: b.batch_date,
    product_name: b.product.product_name,
    expected_output_qty: b.expected_output_qty,
    actual_output_qty: b.actual_output_qty,
    yield_pct: b.yield_pct
  }));

  res.json(result);
}

export async function salesSummary(req: Request, res: Response) {
  const { from, to } = req.query as { from?: string; to?: string };
  const fromDate = from ? new Date(from) : new Date("2000-01-01");
  const toDate = to ? new Date(to) : new Date("2100-01-01");

  const invoices = await prisma.invoice.findMany({
    where: {
      invoice_date: {
        gte: fromDate,
        lte: toDate
      }
    }
  });

  const totalGross = invoices.reduce((s, i) => s + i.gross_total, 0);
  const totalNet = invoices.reduce((s, i) => s + i.net_amount, 0);
  const totalTax = invoices.reduce((s, i) => s + i.tax_amount, 0);

  res.json({
    totalInvoices: invoices.length,
    totalGross,
    totalNet,
    totalTax
  });
}

export async function expiryAndReturns(_req: Request, res: Response) {
  const today = new Date();

  const returns = await prisma.return.findMany({
    include: { product: true },
    orderBy: { return_date: "desc" },
    take: 200
  });

  const expiringBatches = await prisma.batch.findMany({
    include: { product: true }
  });

  const expired = expiringBatches
    .map((b) => {
      const shelf = b.product.shelf_life_days;
      if (!shelf) return null;
      const expDate = addDays(b.batch_date, shelf);
      return expDate < today
        ? {
            batch_id: b.batch_id,
            batch_code: b.batch_code,
            product_name: b.product.product_name,
            batch_date: b.batch_date,
            expiry_date: expDate
          }
        : null;
    })
    .filter((v): v is NonNullable<typeof v> => Boolean(v));

  res.json({
    returns: returns.map((r) => ({
      return_id: r.return_id,
      return_date: r.return_date,
      product_name: r.product.product_name,
      pack_size: r.pack_size,
      pack_unit: r.pack_unit,
      qty_packs: r.qty_packs,
      reason: r.reason,
      adjusted_in_stock: r.adjusted_in_stock
    })),
    expired_batches: expired
  });
}

export async function kpiSummary(_req: Request, res: Response) {
  const [productsCount, customersCount, openOrders, totalNetSales] =
    await Promise.all([
      prisma.product.count(),
      prisma.customer.count(),
      prisma.order.count({
        where: { status: { in: ["PENDING", "CONFIRMED"] } }
      }),
      prisma.invoice
        .aggregate({
          _sum: { net_amount: true }
        })
        .then((a) => a._sum.net_amount || 0)
    ]);

  res.json({
    productsCount,
    customersCount,
    openOrders,
    totalNetSales
  });
}


