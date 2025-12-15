import { Router } from "express";
import { createReturn } from "./returns.controller";
import { authMiddleware, requireRoles } from "../../middleware/authMiddleware";
import { Roles } from "../../utils/roles";

const router = Router();

router.use(authMiddleware);
router.post("/", requireRoles([Roles.OWNER, Roles.MANAGER]), createReturn);

export default router;


