import { OAuth2Token } from "./OAuth2Token";
import { User } from "./User";
import {Falsey, RefreshToken, Token} from "oauth2-server";
import { inject, injectable } from "inversify";
import { ModelType } from "typegoose";
import "reflect-metadata";

@injectable()
export class OAuth2Model {
	private userModel: ModelType<User> & typeof User;
	private oauth2TokenModel: ModelType<OAuth2Token> & typeof OAuth2Token;

	constructor(
		@inject(User) userModel: ModelType<User> & typeof User,
		@inject(OAuth2Token) oauth2TokenModel: ModelType<OAuth2Token> & typeof OAuth2Token
	) {
		this.userModel = userModel;
		this.oauth2TokenModel = oauth2TokenModel;
	}

	async getUser(username: string, password: string): Promise<User | Falsey> {
		let user;
		try {
			user = await this.userModel.findOne({$or: [{username}, {email: username}]})
				.exec()
				.then(user => {
					if (user) {
						return user;
					}
				});
			if (!user.verifyPasswordSync(password)) {
				return false;
			}
		} catch (e) {
			return false;
		}
		return user;
	}

	getClient(clientID, clientSecret, callback) {
		const client = {
			id: clientID,
			grants: ["password", "refresh_token"],
		};
		return callback(false, client);
	}

	saveToken(token, client, user): Promise<Token | Falsey> {
		const userId = typeof user.id == "string" ? user.id : user.toString();
		const oauth = {
			accessToken: token.accessToken,
			accessTokenExpiresAt: token.accessTokenExpiresAt,
			clientId: client.id,
			user: userId
		};

		return this.oauth2TokenModel.updateOrCreate(
			{user: userId},
			oauth
		).then(async (saveResult) => {
			if (!saveResult.refreshToken) {
				saveResult.refreshToken = token.refreshToken;
				saveResult.refreshTokenExpiresAt = token.refreshTokenExpiresAt;
				saveResult = await saveResult.save();
			}
			return {
				accessToken: saveResult.accessToken,
				accessTokenExpiresAt: saveResult.accessTokenExpiresAt,
				refreshToken: saveResult.refreshToken,
				refreshTokenExpiresAt: saveResult.refreshTokenExpiresAt,
				clientId: saveResult.clientId,
				userId: saveResult.user,
				client: saveResult.clientId,
				user: saveResult.user
			};
		});
	}

	getAccessToken(accessToken): Promise<Token | Falsey> {
		return this.oauth2TokenModel.findOne({accessToken})
			.exec()
			.then((token) => {
				if (!token) {
					return false;
				}
				return {
					accessToken: token.accessToken,
					accessTokenExpiresAt: token.accessTokenExpiresAt,
					user: token.user,
					client: token.clientId
				};
			});
	}

	getRefreshToken(refreshToken): Promise<RefreshToken | Falsey> {
		const client = {
			id: "1",
			grants: ["password", "refresh_token"],
		};
		return this.oauth2TokenModel.findOne({refreshToken})
			.exec()
			.then((token) => {
				if (!token) {
					return false;
				}
				return {
					refreshToken: token.refreshToken,
					refreshTokenExpiresAt: token.refreshTokenExpiresAt,
					user: token.user,
					client: client
				};
			});
	}

	revokeToken(token): Promise<boolean> {
		return new Promise((resolve, reject) => {
			resolve(true);
		});
	}

	verifyScope(accessToken, scope): Promise<boolean> {
		return new Promise((resolve, reject) => {
			resolve(true);
		});
	}
}