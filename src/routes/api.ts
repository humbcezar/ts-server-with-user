import { Router } from "express";
import { UserController } from "../controllers/userController";
import { injectable, inject } from "inversify";

@injectable()
export class ApiRouter {
	private userController: UserController;

	constructor(
		@inject(UserController) userController: UserController
	) {
		this.userController = userController;
	}

	getRouter = (): Router => {
		const router = Router();

		router.get("/users/:userName", this.userController.show);
		router.post("/users", this.userController.store);

		return router;
	};
}