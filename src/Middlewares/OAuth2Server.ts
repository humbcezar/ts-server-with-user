import * as OriginalOAuth2Server from "oauth2-server";
import { Request, Response, NextFunction } from "express";
import { Request as OauthRequest } from "oauth2-server";
import { Response as OauthResponse } from "oauth2-server";
import { inject, injectable } from "inversify";
import { OAuth2Model } from "../Models/OAuth2Model";
import "reflect-metadata";

@injectable()
export class OAuth2Server {
	private server: OriginalOAuth2Server;
	private oAuth2Model: OAuth2Model;

	constructor(
		@inject(OAuth2Model) oAuth2Model: OAuth2Model,
		@inject("OriginalOAuth2Server") server: OriginalOAuth2Server
	) {
		this.server = server;
		this.oAuth2Model = oAuth2Model;
	}

	public token = async(req: Request, res: Response) => {
		req.body.grant_type = "password";
		req.body.client_id = 1;
		const oauthRequest = new OauthRequest(req);
		const oauthResponse = new OauthResponse(res);

		try {
			const response = await this.server.token(oauthRequest, oauthResponse);
			res.send(response);
		} catch (err) {
			return res.status(400).send(err.toString() + err.stack + " " + err.name);
		}
	};

	public authenticate = async(req: Request, res: Response, next: NextFunction) => {
		const oauthRequest = new OauthRequest(req);
		const oauthResponse = new OauthResponse(res);

		try {
			const response = await this.server.authenticate(oauthRequest, oauthResponse);
			if (response) {
				return next();
			}
			return res.status(401).send("Unauthenticated");
		} catch (err) {
			return res.status(400).send(err.toString() + err.stack + " " + err.name);
		}
	};
}