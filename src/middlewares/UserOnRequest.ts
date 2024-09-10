import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../database/entities/User";
import { CustomRequest } from "./Auth";


const getRequestedUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const email = (req as CustomRequest)["email"];
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneOrFail({
      where: { email: email },
    });
    (req as CustomRequest)["user"] = user;
    const roles = (req as CustomRequest)["roles"];

    if (req.params.userId != undefined) {
      if (user.id != Number(req.params.userId)) {
        if (roles.length > 0 && roles.indexOf("admin") == -1) {
          return res.status(401).json({ message: "Unauthorized" });
        }
      }
    }

    next();
  } catch (error) {
    res.status(400).json({ message: "User not found" });
  }
};
export default getRequestedUser;