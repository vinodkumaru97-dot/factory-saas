import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export const signToken = (payload: object): string => {
  const options: SignOptions = {
    expiresIn: "1d"
  };

  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = <T>(token: string): T => {
  return jwt.verify(token, JWT_SECRET) as T;
};
