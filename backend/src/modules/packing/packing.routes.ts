import { Router } from "express";
import { createPacking } from "./packing.controller";
import { authMiddleware, requireRoles } from "../../middleware/authMiddleware";
import { Roles } from "../../utils/roles";

const router = Router();

router.use(authMiddleware);
router.post("/", requireRoles([Roles.OWNER, Roles.MANAGER]), createPacking);

export default router;


