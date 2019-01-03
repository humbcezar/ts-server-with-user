import {inject, injectable} from "inversify";
import {Request, Response} from "express";
import {GoogleOAuth2Client} from "../Services/GoogleClient/GoogleOAuth2Client";

@injectable()
export class GoogleController {
	private googleOAuth2Client: GoogleOAuth2Client;

	constructor(
		@inject(GoogleOAuth2Client) googleOAuth2Client: GoogleOAuth2Client
	) {
		this.googleOAuth2Client = googleOAuth2Client;
	}

	showUrl = (req: Request, res: Response) => {
		const url = this.googleOAuth2Client.generateAuthUrl();
		res.send(url);
	};
}