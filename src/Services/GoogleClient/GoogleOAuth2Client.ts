import {injectable} from "inversify";
import {google} from "googleapis";
import {OAuth2Client} from "google-auth-library";
import * as dotenv from "dotenv";
import "reflect-metadata";

@injectable()
export class GoogleOAuth2Client {
	private readonly client: OAuth2Client;

	constructor() {
		dotenv.config();
		this.client = new google.auth.OAuth2(
			process.env.GOOGLE_CLIENT_ID,
			process.env.GOOGLE_CLIENT_SECRET,
			process.env.APP_URL + "/api/users/external/login",
		);
	}

	setCredentials (tokens) {
		this.client.setCredentials(tokens);
	}

	async getTokens (code: string) {
		const {tokens} = await this.client.getToken(code);
		return tokens;
	}

	async getUserInfo() {
		const oauth = google.oauth2({
			version: "v2",
			auth: this.client
		});
		return await oauth.userinfo.get();
	}

	generateAuthUrl() {
		return this.client.generateAuthUrl({
			access_type: "offline",
			scope: [
				"https://www.googleapis.com/auth/userinfo.profile",
				"https://www.googleapis.com/auth/userinfo.email"
			]
		});
	}
}