import { Router } from "express";
import { prisma } from "../../config/prisma";
import { createCrudRouter } from "../../crud/crud.controller";
import { authMiddleware, requireRoles } from "../../middleware/authMiddleware";
import { Roles } from "../../utils/roles";

const router = Router();

router.use(authMiddleware);
router.use(
  "/",
  requireRoles([Roles.OWNER, Roles.MANAGER]),
  createCrudRouter(prisma, { modelName: "product", idField: "product_id" })
);

export default router;


