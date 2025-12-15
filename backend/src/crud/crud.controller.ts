import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

type CrudConfig = {
  modelName: keyof PrismaClient;
  idField: string;
};

export function createCrudRouter(prisma: PrismaClient, config: CrudConfig) {
  const router = Router();
  const model = (prisma as any)[config.modelName];
  const idField = config.idField;

  router.get("/", async (req: Request, res: Response) => {
    const { skip = "0", take = "50", ...filters } = req.query as any;
    const where: any = {};
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== "") where[k] = v;
    });

    const [items, total] = await Promise.all([
      model.findMany({
        where,
        skip: Number(skip),
        take: Number(take),
        orderBy: { [idField]: "desc" }
      }),
      model.count({ where })
    ]);

    res.json({ items, total });
  });

  router.get("/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const item = await model.findUnique({ where: { [idField]: id } });
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  });

  router.post("/", async (req: Request, res: Response) => {
    const created = await model.create({ data: req.body });
    res.status(201).json(created);
  });

  router.put("/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const updated = await model.update({
      where: { [idField]: id },
      data: req.body
    });
    res.json(updated);
  });

  router.delete("/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await model.delete({ where: { [idField]: id } });
    res.status(204).send();
  });

  return router;
}


