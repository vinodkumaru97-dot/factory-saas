import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma";
import { signToken } from "../utils/jwt";

export async function login(req: Request, res: Response) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password required" });
  }

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || !user.is_active) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = signToken({ userId: user.user_id, role: user.role });

  return res.json({
    token,
    user: {
      id: user.user_id,
      username: user.username,
      role: user.role
    }
  });
}


