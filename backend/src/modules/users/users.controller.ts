import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../../config/prisma";

// List all users (basic)
export async function listUsers(_req: Request, res: Response) {
  const users = await prisma.user.findMany({
    orderBy: { user_id: "desc" },
    select: {
      user_id: true,
      username: true,
      role: true,
      is_active: true,
      created_at: true
    }
  });
  res.json(users);
}

// Create user with plaintext password -> hashed
export async function createUser(req: Request, res: Response) {
  const { username, password, role, is_active } = req.body as {
    username: string;
    password: string;
    role: string;
    is_active?: boolean;
  };

  if (!username || !password || !role) {
    return res
      .status(400)
      .json({ message: "username, password and role are required" });
  }

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    return res.status(409).json({ message: "Username already exists" });
  }

  const password_hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      password_hash,
      role,
      is_active: is_active ?? true
    },
    select: {
      user_id: true,
      username: true,
      role: true,
      is_active: true,
      created_at: true
    }
  });

  res.status(201).json(user);
}

// Update user; password optional
export async function updateUser(req: Request, res: Response) {
  const id = Number(req.params.id);
  const { password, role, is_active } = req.body as {
    password?: string;
    role?: string;
    is_active?: boolean;
  };

  const data: any = {};
  if (role !== undefined) data.role = role;
  if (is_active !== undefined) data.is_active = is_active;
  if (password) {
    data.password_hash = await bcrypt.hash(password, 10);
  }

  const user = await prisma.user.update({
    where: { user_id: id },
    data,
    select: {
      user_id: true,
      username: true,
      role: true,
      is_active: true,
      created_at: true
    }
  });

  res.json(user);
}

export async function deleteUser(req: Request, res: Response) {
  const id = Number(req.params.id);
  await prisma.user.delete({ where: { user_id: id } });
  res.status(204).send();
}


