import { Router } from "express";
import { UserController } from "../Controllers/UserController";
import { injectable, inject } from "inversify";
import { OAuth2Server } from "../Middlewares/OAuth2Server";
import "reflect-metadata";

@injectable()
export class ApiRouter {
	private userController: UserController;
	private oAuth2Server: OAuth2Server;

	constructor(
		@inject(UserController) userController: UserController,
		@inject(OAuth2Server) oAuth2Server: OAuth2Server
	) {
		this.userController = userController;
		this.oAuth2Server = oAuth2Server;
	}

	getRouter = (): Router => {
		const router = Router();

		router.get("/users/restricted-area", this.oAuth2Server.authenticate, (req, res) => {
			res.send("You entered restricted area");
		});
		router.post("/users/login", this.oAuth2Server.token);
		router.get("/users/:userName", this.userController.show);
		router.post("/users", this.userController.store);

		return router;
	};
}