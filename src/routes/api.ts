import { Router } from "express";
import userController from "../controllers/userController";

const router = Router();

router.get("/users/:userName", userController.show);
router.post("/users", userController.store);

export default router;