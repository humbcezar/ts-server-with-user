import {inject, injectable} from "inversify";
import {User} from "../../Models/User";
import {ModelType} from "typegoose";
import {OAuth2Token} from "../../Models/OAuth2Token";
import {Creator} from "../User/Creator";
import * as randomString from "randomstring";
import {GoogleOAuth2Client} from "./GoogleOAuth2Client";
import "reflect-metadata";

@injectable()
export class Auth {
	private googleOAuth2Client: GoogleOAuth2Client;
	private userModel: ModelType<User> & typeof User;
	private oauth2TokenModel: ModelType<OAuth2Token> & typeof OAuth2Token;
	private creator: Creator;

	constructor(
		@inject(GoogleOAuth2Client) googleOAuth2Client: GoogleOAuth2Client,
		@inject(User) userModel: ModelType<User> & typeof User,
		@inject(OAuth2Token) oauth2TokenModel: ModelType<OAuth2Token> & typeof OAuth2Token,
		@inject(Creator) creator: Creator,
	) {
		this.googleOAuth2Client = googleOAuth2Client;
		this.userModel = userModel;
		this.oauth2TokenModel = oauth2TokenModel;
		this.creator = creator;
	}

	token = async(code: string) => {
		const tokens = await this.googleOAuth2Client.getTokens(code);
		this.googleOAuth2Client.setCredentials(tokens);
		const userInfo = await this.googleOAuth2Client.getUserInfo();

		const localUser = await this.findUser(userInfo);
		if (localUser) {
			return this.saveToken(localUser, tokens);
		}

		const newUser = await this.creator.create({
			username: randomString.generate(12),
			password: randomString.generate(12),
			email: userInfo.data.email,
			google_account_id: userInfo.data.id
		});

		return this.saveToken(newUser, tokens);
	};

	authenticate = async(accessToken: string) => {
		const token = await this.oauth2TokenModel.findOne({
			$or: [{
					accessToken
				},{
					refreshToken: accessToken
				}]
			})
			.populate({path: "user", model: "User"})
			.exec();

		if (!token) {
			return false;
		}

		this.googleOAuth2Client.setCredentials({
			refresh_token: token.refreshToken,
			expiry_date: token.accessTokenExpiresAt.getTime(),
			access_token: token.accessToken,
			token_type: token.tokenType,
			id_token: token.tokenId
		});

		const userInfo = await this.googleOAuth2Client.getUserInfo();

		return userInfo.data.email == token.user.email;
	};

	private findUser = (userInfo) => {
		return this.userModel.findOneAndUpdate(
			{email: userInfo.data.email},
			{google_account_id: userInfo.data.id}
		);
	};

	private saveToken = (user, token) => {
		const refresh = token.refresh_token ? {refreshToken: token.refresh_token} : {};
		return this.oauth2TokenModel.updateOrCreate(
			{user: user.id},
			{
				...{
					accessToken: token.access_token,
					accessTokenExpiresAt: token.expiry_date,
					clientId: 1,
					user: user.id,
					tokenId: token.id_token,
					tokenType: token.token_type
				},
				...refresh
			}
		);
	};
}