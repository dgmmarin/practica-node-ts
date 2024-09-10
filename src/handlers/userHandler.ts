
import { Request, Response } from "express";
import { Catch, HasRole, Roles } from "../decorators";
import { CustomRequest } from "../middlewares/Auth";
import { plainToInstance } from "class-transformer";
import UserController from "../controllers/user/UserController";
import SanitizedUser from "../serializers/user";
import { User } from "../database/entities/User";

export class UserHandler {
  controller: UserController;
  constructor() {
    this.controller = new UserController();
    this.listUsers = this.listUsers.bind(this);
    this.getUser = this.getUser.bind(this);
    this.createUser = this.createUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.addRole = this.addRole.bind(this);
    this.removeRole = this.removeRole.bind(this);
    this.listOrders = this.listOrders.bind(this);
    this.getOrder = this.getOrder.bind(this);
  }

//   @Roles(["admin"])
  async createUser(req: Request, res: Response) {
    try {
      const user = await this.controller.createUser(
        (req as CustomRequest)["createUserDto"],
      );
      res.json(plainToInstance(SanitizedUser, user));
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error });
    }
  }

  @Roles(["admin", "user"])
  async getUser(req: Request, res: Response) {
    try {
      const user = await this.controller.getUser(Number(req.params.userId));
      res.json(plainToInstance(SanitizedUser, user, {}));
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }

  @HasRole("admin")
  async addRole(req: Request, res: Response) {
    try {
      const user = this.controller.addRole(
        Number(req.params.userId),
        Number(req.params.roleId),
      );
      return res.json(plainToInstance(SanitizedUser, user, {}));
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error });
    }
  }

  @HasRole("admin")
  async removeRole(req: Request, res: Response) {
    try {
      const user = this.controller.removeRole(
        Number(req.params.userId),
        Number(req.params.roleId),
      );
      return res.json(plainToInstance(SanitizedUser, user, {}));
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error });
    }
  }

  @Roles(["admin"])
  async updateUser(req: Request, res: Response) {
    try {
      const result = await this.controller.updateUser(
        Number(req.params.userId),
        (req as CustomRequest)["updateUserDto"],
      );
      res.json(plainToInstance(SanitizedUser, result));
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error });
    }
  }

  @Roles(["admin"])
  async deleteUser(req: Request, res: Response) {
    try {
      await this.controller.deleteUser(Number(req.params.userId));
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: "User not found" });
    }
  }

  @Roles(["admin"])
  async listUsers(req: Request, res: Response) {
    try {
      const users = await this.controller.listUsers();
      const usersForReturn = users.map((user) =>
        plainToInstance(SanitizedUser, user),
      );
      res.json(usersForReturn);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Users not found" });
    }
  }

  getUserByEmail = async (email: string): Promise<User | null> => {
    try {
      return await this.controller.getUserByEmail(email);
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  async listOrders(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const orders = await this.controller.listOrders(Number(userId));
      res.json(orders);
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }

  @Catch(["QueryFailedError", "EntityNotFoundError"])
  async getOrder(req: Request, res: Response) {
    const { userId, orderId } = req.params;
    const order = await this.controller.getOrder(Number(userId), Number(orderId));
    res.json(order);
  }
}