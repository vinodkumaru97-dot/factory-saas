import { Router } from "express";
import { createBatch } from "./batches.controller";
import { authMiddleware, requireRoles } from "../../middleware/authMiddleware";
import { Roles } from "../../utils/roles";

const router = Router();

router.use(authMiddleware);
router.post("/", requireRoles([Roles.OWNER, Roles.MANAGER]), createBatch);

export default router;


