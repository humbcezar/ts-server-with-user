import "../../testBase";
import "jest";
import {OAuth2Server} from "../../../src/Middlewares/OAuth2Server";
import container from "../../../src/inversify.config";
import {Creator} from "../../../src/Services/User/Creator";
import * as randomString from "randomstring";
import {anything} from "ts-mockito";
import createOAuth2Token from "../../factories/OAuth2Token";
const mockReqRes = require("mock-req-res");

describe("unit/Middlewares/OAuth2Server", () => {

	it("should issue token for existing user using password grant", async () => {
		const creator = container.get<Creator>(Creator);
		const password = randomString.generate(5);
		const user = await creator.create({
			username: randomString.generate(10),
			email: randomString.generate(5) + "@" + randomString.generate(5) + ".com",
			password: password,
		});

		const oauth2Server = container.get<OAuth2Server>(OAuth2Server);

		const req = mockReqRes.mockRequest();
		req.body = {
			username: user.username,
			password: password,
		};
		mockRequestHeader(req);
		req.method = "POST";

		const res = mockReqRes.mockResponse();

		const sendSpy = spyOn(res, "send");
		await oauth2Server.token(req, res);

		expect(Object.keys(sendSpy.calls.mostRecent().args[0]).sort()).toEqual([
			"accessToken",
			"accessTokenExpiresAt",
			"client",
			"clientId",
			"refreshToken",
			"refreshTokenExpiresAt",
			"user",
			"userId",
		]);
	});

	it("should not issue a token for password grant", async () => {
		const oauth2Server = container.get<OAuth2Server>(OAuth2Server);

		const req = mockReqRes.mockRequest();
		req.body = {
			username: randomString.generate(10),
			password: randomString.generate(10),
		};
		mockRequestHeader(req);
		req.method = "POST";

		const res = {
			...anything(),
			...{
				send(arg) {
					return arg;
				},
				status() {
					return this;
				}
			}
		};

		const response = await oauth2Server.token(req, res);

		expect(response).toBe("Invalid credentials");
	});

	it("should issue token for existing user using refresh grant", async () => {
		const creator = container.get<Creator>(Creator);
		const password = randomString.generate(5);
		const user = await creator.create({
			username: randomString.generate(10),
			email: randomString.generate(5) + "@" + randomString.generate(5) + ".com",
			password: password,
		});

		const oauth2token = await createOAuth2Token({"user": user.id});

		const oauth2Server = container.get<OAuth2Server>(OAuth2Server);

		const req = mockReqRes.mockRequest();
		req.body = {
			grant_type: "refresh_token",
			refresh_token: oauth2token.refreshToken,
		};
		mockRequestHeader(req);
		req.method = "POST";

		const res = mockReqRes.mockResponse();

		const sendSpy = spyOn(res, "send");
		await oauth2Server.token(req, res);

		expect(Object.keys(sendSpy.calls.mostRecent().args[0]).sort()).toEqual([
			"accessToken",
			"accessTokenExpiresAt",
			"client",
			"clientId",
			"refreshToken",
			"refreshTokenExpiresAt",
			"user",
			"userId",
		]);
	});

	it("should not issue a token for refresh grant", async () => {
		const oauth2Server = container.get<OAuth2Server>(OAuth2Server);

		const req = mockReqRes.mockRequest();
		req.body = {
			grant_type: "refresh_token",
			refresh_token: randomString.generate(10),
		};
		mockRequestHeader(req);

		req.method = "POST";
		const res = {
			...anything(),
			...{
				send(arg) {
					return arg;
				},
				status() {
					return this;
				}
			}
		};

		const response = await oauth2Server.token(req, res);

		expect(response).toBe("Invalid credentials");
	});

	it("should authenticate", async () => {
		const creator = container.get<Creator>(Creator);
		const password = randomString.generate(5);
		const user = await creator.create({
			username: randomString.generate(10),
			email: randomString.generate(5) + "@" + randomString.generate(5) + ".com",
			password: password,
		});

		const oauth2token = await createOAuth2Token({"user": user.id});

		const oauth2Server = container.get<OAuth2Server>(OAuth2Server);

		const req = mockReqRes.mockRequest();

		mockRequestHeader(req);
		req.headers.Authorization = "Bearer " + oauth2token.accessToken;

		req.method = "POST";
		const res = {
			...anything(),
			...{
				send(arg) {
					return arg;
				},
				status() {
					return this;
				},
				locals: {
					authenticated: false
				}
			}
		};

		const next = () => {
			return "called";
		};

		const response = await oauth2Server.authenticate(req, res, next);

		expect(response).toBe("called");
	});

	it("should not authenticate", async () => {
		const oauth2Server = container.get<OAuth2Server>(OAuth2Server);

		const req = mockReqRes.mockRequest();

		mockRequestHeader(req);
		req.headers.Authorization = "Bearer gibberish";

		req.method = "POST";
		const res = {
			...anything(),
			...{
				send(arg) {
					return arg;
				},
				status() {
					return this;
				},
				locals: {
					authenticated: false
				}
			}
		};

		const next = () => {
			return "";
		};

		const response = await oauth2Server.authenticate(req, res, next);

		expect(response).toBe("Unauthenticated");
	});
});

function mockRequestHeader(req) {
	req.headers = {
		"content-type": "application/x-www-form-urlencoded",
		"cache-control": "no-cache",
		"postman-token": "b24f63fa-9b50-404b-82ce-04cbb283e756",
		"user-agent": "PostmanRuntime/7.4.0",
		"accept": "*/*",
		"host": "localhost:3000",
		"accept-encoding": "gzip, deflate",
		"content-length": "28",
		"connection": "keep-alive"
	};
}