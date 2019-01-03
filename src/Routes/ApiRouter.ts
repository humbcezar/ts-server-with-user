import { Router } from "express";
import { UserController } from "../Controllers/UserController";
import { injectable, inject } from "inversify";
import { OAuth2Server } from "../Middlewares/OAuth2Server";
import "reflect-metadata";
import {GoogleController} from "../Controllers/GoogleController";
import {GoogleAuth} from "../Middlewares/GoogleAuth";

@injectable()
export class ApiRouter {
	private userController: UserController;
	private oAuth2Server: OAuth2Server;
	private googleController: GoogleController;
	private googleAuth: GoogleAuth;

	constructor(
		@inject(UserController) userController: UserController,
		@inject(OAuth2Server) oAuth2Server: OAuth2Server,
		@inject(GoogleController) googleController: GoogleController,
		@inject(GoogleAuth) googleAuth: GoogleAuth
	) {
		this.userController = userController;
		this.oAuth2Server = oAuth2Server;
		this.googleController = googleController;
		this.googleAuth = googleAuth;
	}

	getRouter = (): Router => {
		const router = Router();

		router.get("/users/restricted-area",
			this.googleAuth.authenticate,
			this.oAuth2Server.authenticate,
			(req, res) => {
				return res.send("You entered restricted area");
			}
		);

		router.post("/users/login", this.oAuth2Server.token);
		router.get("/users/external/login", this.googleAuth.token);
		router.get("/users/:userName", this.userController.show);
		router.post("/users", this.userController.store);

		router.get("/google/show", this.googleController.showUrl);

		return router;
	};
}