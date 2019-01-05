import * as randomString from "randomstring";
import {OAuth2Token} from "../../src/Models/OAuth2Token";

export default function createOAuth2Token(properties = {}) {
	const oAuth2TokenModel = new OAuth2Token().getModelForClass(OAuth2Token);
	const oAuth2Token = new oAuth2TokenModel({
		...{
			"clientId": 1,
			"accessToken": randomString.generate(10),
			"accessTokenExpiresAt": new Date(new Date(new Date().getTime() + 5000000000)),
			"refreshToken": randomString.generate(10),
			"refreshTokenExpiresAt": new Date(new Date(new Date().getTime() + 5000000000))
		},
		...properties
	});
	return oAuth2Token.save();
}