import { Router } from "express";
import { prisma } from "../config/prisma";
import { createCrudRouter } from "./crud.controller";
import { authMiddleware, requireRoles } from "../middleware/authMiddleware";
import { Roles } from "../utils/roles";

const router = Router();

router.use(authMiddleware);

router.use(
  "/users",
  requireRoles([Roles.OWNER]),
  createCrudRouter(prisma, { modelName: "user", idField: "user_id" })
);

router.use(
  "/raw-materials",
  requireRoles([Roles.OWNER, Roles.MANAGER]),
  createCrudRouter(prisma, { modelName: "rawMaterial", idField: "rm_id" })
);

router.use(
  "/products",
  requireRoles([Roles.OWNER, Roles.MANAGER]),
  createCrudRouter(prisma, { modelName: "product", idField: "product_id" })
);

router.use(
  "/customers",
  requireRoles([Roles.OWNER, Roles.MANAGER]),
  createCrudRouter(prisma, { modelName: "customer", idField: "customer_id" })
);

router.use(
  "/orders",
  requireRoles([Roles.OWNER, Roles.MANAGER]),
  createCrudRouter(prisma, { modelName: "order", idField: "order_id" })
);

router.use(
  "/invoices",
  requireRoles([Roles.OWNER, Roles.MANAGER]),
  createCrudRouter(prisma, { modelName: "invoice", idField: "invoice_id" })
);

export default router;


