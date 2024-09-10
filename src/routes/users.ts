import { Router } from "express";
import { UserHandler } from "../handlers/userHandler";
import { validateUserCreate, validateUserUpdate } from "../validators/user";


const router = Router();
const handler = new UserHandler();
router.get("/:userId", handler.getUser);
router.get("/", handler.listUsers);
router.get("/:userId", handler.getUser);
router.post("/", validateUserCreate, handler.createUser);
router.put("/:userId", validateUserUpdate, handler.updateUser);
router.delete("/:userId", handler.deleteUser);
router.post("/:userId/roles/:roleId", handler.addRole);
router.delete("/:userId/roles/:roleId", handler.removeRole);
router.get("/:userId/orders", handler.listOrders);
router.get("/:userId/orders/:orderId", handler.getOrder);
export default router;