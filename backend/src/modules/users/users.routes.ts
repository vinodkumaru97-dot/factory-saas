import { Router } from "express";
import {
  listUsers,
  createUser,
  updateUser,
  deleteUser
} from "./users.controller";
import { authMiddleware, requireRoles } from "../../middleware/authMiddleware";
import { Roles } from "../../utils/roles";

const router = Router();

router.use(authMiddleware);
router.use(requireRoles([Roles.OWNER]));

router.get("/", listUsers);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;


