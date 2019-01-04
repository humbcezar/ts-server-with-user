import {NextFunction, Request, Response} from "express";
import {inject, injectable} from "inversify";
import {Auth} from "../Services/GoogleClient/Auth";

@injectable()
export class GoogleAuth {
	private googleAuth: Auth;

	constructor(
		@inject(Auth) googleAuth: Auth
	) {
		this.googleAuth = googleAuth;
	}

	token = async(req: Request, res: Response,  next: NextFunction) => {
		if (!req.query.code) {
			next();
		}
		try {
			const token = await this.googleAuth.token(req.query.code);
			return res.send(token);
		} catch (err) {
			return res.status(400).send("Invalid credentials");
		}
	};

	authenticate = async(req: Request, res: Response,  next: NextFunction) => {
		if (res.locals.authenticated) {
			return next();
		}
		res.locals.authenticated = false;
		const accessKey = req.headers.authorization.replace("Bearer ", "");
		try {
			if (await this.googleAuth.authenticate(accessKey)) {
				res.locals.authenticated = true;
				return next();
			}
			return next();
		} catch (err) {
			return next();
		}
	};
}