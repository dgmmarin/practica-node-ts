import { Exclude } from "class-transformer";
import { User } from "../database/entities/User";

export default class SanitizedUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  @Exclude()
  password: string;
  createdAt: Date;
  @Exclude()
  updatedAt: Date;
  @Exclude()
  deletedAt: Date;
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}