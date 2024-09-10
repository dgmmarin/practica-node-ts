import { Router, Request, Response, } from "express";
import UserController from "../controllers/user/UserController";
import authService from "../utils/AuthService";
import { UserHandler } from "../handlers/userHandler";
import { CustomRequest } from "../middlewares/Auth";
import { plainToInstance } from "class-transformer";
import SanitizedUser from "../serializers/user";
import { validateUserCreate } from "../validators/user";

const router = Router();
const controller = new UserController();
const handler = new UserHandler();

router.post("/login", async (req: Request, res: Response) => {
  const user = await controller.getUserByEmail(req.body.email);
  if (user) {
    const validUSer = authService.comparePassword(
      req.body.password,
      user.password,
    );
    if (validUSer) {
      return res.json({ auth_token: authService.generateAccessToken(user) });
    } else {
      res.status(400).json({ message: "Invalid credentials" });
    }
  } else {
    res.status(400).json({ message: "Invalid credentials." });
  }
});

router.post("/register",  validateUserCreate ,handler.createUser);

export default router;