import jwt from "jsonwebtoken";
import { ENV } from "../config/env";

export interface JwtPayload {
  userId: number;
  role: string;
}

export function signToken(payload: JwtPayload, expiresIn = "8h") {
  return jwt.sign(payload, ENV.JWT_SECRET, { expiresIn });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;
}


