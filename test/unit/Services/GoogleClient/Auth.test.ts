import "../../testBase";
import "jest";
import {GoogleOAuth2Client} from "../../../../src/Services/GoogleClient/GoogleOAuth2Client";
import {Auth} from "../../../../src/Services/GoogleClient/Auth";
import {anything, instance, mock, when} from "ts-mockito";
import {User} from "../../../../src/Models/User";
import {OAuth2Token} from "../../../../src/Models/OAuth2Token";
import {Creator} from "../../../../src/Services/User/Creator";
import * as randomString from "randomstring";
import container from "../../../../src/inversify.config";
import {ObjectID} from "mongodb";

describe("unit/Services/GoogleClient/Auth", () => {

	const oauth2TokenModel = new OAuth2Token().getModelForClass(OAuth2Token);
	afterAll(async () => {
		await oauth2TokenModel.deleteMany({});
	});

	it("should generate and persist token for new a user, and then authenticate", async () => {
		const code = randomString.generate(10);
		const {tokenMock, googleOAuth2Client, userModel} = setUpMocks(
			"", "", code
		);

		const creator = container.get<Creator>(Creator);
		const auth = new Auth(
			googleOAuth2Client,
			userModel,
			oauth2TokenModel,
			creator,
		);

		const token = await auth.token(code);
		expect(token).toMatchObject({
			accessToken: tokenMock.access_token,
			accessTokenExpiresAt: new Date(tokenMock.expiry_date),
			clientId: 1,
			tokenId: tokenMock.id_token,
			tokenType: tokenMock.token_type,
			refreshToken: token.refreshToken
		});

		expect(await auth.authenticate(token.accessToken)).toBe(true);
		expect(await auth.authenticate(token.refreshToken)).toBe(true);

	});

	it("should generate and persist token for a existing user, and then authenticate", async () => {
		const code = randomString.generate(10);
		const {tokenMock, googleOAuth2Client, userModel, userInfoMock} = setUpMocks(
			"","",	code
		);

		const creator = container.get<Creator>(Creator);
		const user = await creator.create({
			username: randomString.generate(10),
			email: userInfoMock.data.email,
			password: randomString.generate(10),
		});

		const auth = new Auth(
			googleOAuth2Client,
			userModel,
			oauth2TokenModel,
			creator,
		);

		const token = await auth.token(code);
		expect(token).toMatchObject({
			accessToken: tokenMock.access_token,
			accessTokenExpiresAt: new Date(tokenMock.expiry_date),
			clientId: 1,
			tokenId: tokenMock.id_token,
			tokenType: tokenMock.token_type,
			user: new ObjectID(user.id),
			refreshToken: token.refreshToken
		});

		expect(await auth.authenticate(token.accessToken)).toBe(true);
		expect(await auth.authenticate(token.refreshToken)).toBe(true);

	});

	it("should not issue a token", async () => {
		const code = randomString.generate(10);
		const {userModel} = setUpMocks("", "", code);

		const creator = container.get<Creator>(Creator);

		const googleOAuth2ClientMock = mock(GoogleOAuth2Client);
		when(googleOAuth2ClientMock.getTokens("test")).thenReject(new Error("invalid_grant"));
		const googleOAuth2Client = instance(googleOAuth2ClientMock);

		const auth = new Auth(
			googleOAuth2Client,
			userModel,
			oauth2TokenModel,
			creator,
		);

		let error;
		try {
			await auth.token("test");
		} catch (err) {
			error = err;
		}

		expect(error).toBeInstanceOf(Error);
		expect(error.toString()).toBe("Error: invalid_grant");
	});

	it("should not authenticate", async () => {
		const code = randomString.generate(10);
		const {googleOAuth2Client, userModel} = setUpMocks("", "", code);

		const creator = container.get<Creator>(Creator);
		const auth = new Auth(
			googleOAuth2Client,
			userModel,
			oauth2TokenModel,
			creator,
		);

		expect(await auth.authenticate("asdasd")).toStrictEqual(false);
	});
});

function buildTokenMock(refresh = undefined) {
	return {
		access_token: randomString.generate(10),
		expiry_date: new Date().getTime(),
		id_token: randomString.generate(10),
		refresh_token: refresh ? refresh : randomString.generate(10),
		token_type: randomString.generate(10)
	};
}

function buildUserInfoMock(userEmail = undefined) {
	return {
		...anything(),
		...{
			data: {
				email: userEmail ? userEmail : randomString.generate(5) + "@" + randomString.generate(5) + ".com",
				id: randomString.generate(10)
			}
		}
	};
}

function setUpMocks(refresh = undefined, userEmail = undefined, code) {
	const userInfoMock = buildUserInfoMock(userEmail);
	const tokenMock = buildTokenMock(refresh);
	const googleOAuth2ClientMock = mock(GoogleOAuth2Client);
	when(googleOAuth2ClientMock.getTokens(code)).thenResolve(tokenMock);
	when(googleOAuth2ClientMock.getUserInfo()).thenResolve(userInfoMock);
	const googleOAuth2Client = instance(googleOAuth2ClientMock);
	const userModel = new User().getModelForClass(User);
	return {tokenMock, googleOAuth2Client, userModel, userInfoMock};
}