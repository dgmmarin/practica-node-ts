import { validate } from "class-validator";
import { NextFunction, Response, Request } from "express";
import { CreateUserDto, UpdateUserDto } from "../dto/user.dto";
import { CustomRequest } from "../middlewares/Auth";

const validateUserCreate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let createdUser: CreateUserDto = new CreateUserDto();
    createdUser = Object.assign(createdUser, req.body);
    const errs = await validate(createdUser);
    if (errs.length > 0) {
      return res.status(400).json({ errors: errs });
    } else {
      (req as CustomRequest)["createUserDto"] = createdUser;
      next();
    }
  } catch (error) {
    return res.status(400).json({ errors: error });
  }
};

const validateUserUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let updateUserDto = new UpdateUserDto();
    updateUserDto = Object.assign(updateUserDto, req.body);
    const errs = await validate(updateUserDto);
    if (errs.length > 0) {
      return res.status(400).json({ errors: errs });
    } else {
      (req as CustomRequest)["updateUserDto"] = updateUserDto;
      next();
    }
  } catch (error) {
    return res.status(400).json({ errors: error });
  }
};

export { validateUserCreate, validateUserUpdate };