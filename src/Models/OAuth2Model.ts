import { OAuth2Token } from "./OAuth2Token";
import { User } from "./User";
import { Falsey, Token } from "oauth2-server";
import { inject, injectable } from "inversify";
import { ModelType } from "typegoose";
import "reflect-metadata";

@injectable()
export class OAuth2Model {
	private userModel: ModelType<User>;
	private oauth2TokenModel: ModelType<OAuth2Token>;

	constructor(
		@inject(User) userModel: ModelType<User>,
		@inject(OAuth2Token) oauth2TokenModel: ModelType<OAuth2Token>
	) {
		this.userModel = userModel;
		this.oauth2TokenModel = oauth2TokenModel;
	}

	async getUser(username: string, password: string): Promise<User | Falsey> {
		let user;
		try {
			user = await this.userModel.findOne({username: username})
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
			grants: ["password"],
		};
		return callback(false, client);
	}

	saveToken(token, client, user): Promise<Token | Falsey> {
		const oauth = {
			accessToken: token.accessToken,
			accessTokenExpiresOn: token.accessTokenExpiresAt,
			clientId: client.id,
			userId: user.id,
		};

		return this.oauth2TokenModel.findOneAndUpdate(
			{userId: user.id},
			oauth,
			{upsert: true, new: true, runValidators: true}
		).then((saveResult) => {
			return {
				accessToken: saveResult.accessToken,
				accessTokenExpiresOn: saveResult.accessTokenExpiresOn,
				refreshToken: saveResult.refreshToken,
				refreshTokenExpiresOn: saveResult.refreshTokenExpiresOn,
				clientId: saveResult.clientId,
				userId: saveResult.userId,
				client: saveResult.clientId,
				user: saveResult.userId
			};
		});
	}

	getAccessToken(accessToken): Promise<Token | Falsey> {
		return this.oauth2TokenModel.findOne({accessToken})
			.populate("userID")
			.exec()
			.then((token) => {
				if (!token) {
					return false;
				}
				return {
					accessToken: token.accessToken,
					accessTokenExpiresAt: token.accessTokenExpiresOn,
					user: token.userId,
					client: token.clientId
				};
			});
	}

	verifyScope(accessToken, scope): Promise<boolean> {
		return new Promise((resolve, reject) => {
			resolve(true);
		});
	}
}