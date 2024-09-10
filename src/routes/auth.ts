import { Router, Request, Response } from "express";
import UserController from "../controllers/user/UserController";
import authService from "../utils/AuthService";

const router = Router();
const controller = new UserController();

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

export default router;