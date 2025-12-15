import { Router } from "express";
import { createDispatch } from "./dispatches.controller";
import { authMiddleware, requireRoles } from "../../middleware/authMiddleware";
import { Roles } from "../../utils/roles";

const router = Router();

router.use(authMiddleware);
router.post("/", requireRoles([Roles.OWNER, Roles.MANAGER]), createDispatch);

export default router;


