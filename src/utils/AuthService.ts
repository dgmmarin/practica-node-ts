/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { User } from "../database/entities/User";
import jwt, { Secret } from "jsonwebtoken";
dotenv.config();


export default class AuthService {
  static saltRounds: number = process.env.NODE_PASSWORD_SALT
    ? Number(process.env.NODE_PASSWORD_SALT)
    : 10;
  static jwtSecret: Secret = process.env.NODE_JWT_SECRET ?? "secret";

  static hashPassword = (password: string): string => {
    const salt = bcrypt.genSaltSync(this.saltRounds);
    return bcrypt.hashSync(password, salt);
  };

  static comparePassword = (password: string, hash: string): boolean => {
    return bcrypt.compareSync(password, hash);
  };

  static generateAccessToken = (user: User): string => {
    return jwt.sign(
      {
        email: user.email,
        roles: user.roles.map((role) => role.name),
      },
      this.jwtSecret,
      { expiresIn: "1h" },
    );
  };

  static verifyToken = (token: string): any => {
    return jwt.verify(token, this.jwtSecret);
  };
}