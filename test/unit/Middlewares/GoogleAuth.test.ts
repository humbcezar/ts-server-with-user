import "../../testBase";
import "jest";
import {GoogleAuth} from "../../../src/Middlewares/GoogleAuth";
import {Auth} from "../../../src/Services/GoogleClient/Auth";
import {anything, instance, mock, when} from "ts-mockito";

describe("unit/Middlewares/GoogleAuth.test", () => {
	it("should issue token", async () => {
		const auth = mock(Auth);
		const token = mockToken();
		when(auth.token("abc")).thenResolve(token);
		const authMock = instance(auth);
		const googleAuth = new GoogleAuth(authMock);

		const req = mockReq();
		const res = mockRes();
		const next = mockNext();

		const response = await googleAuth.token(req, res, next);

		expect(response).toBe(token);
	});

	it("should not issue token", async () => {
		const auth = mock(Auth);
		when(auth.token("abc")).thenReject(new Error());
		const authMock = instance(auth);
		const googleAuth = new GoogleAuth(authMock);

		const req = mockReq();
		const res = mockRes();
		const next = mockNext();

		const response = await googleAuth.token(req, res, next);

		expect(response).toBe("Invalid credentials");
	});

	it("should authenticate", async () => {
		const auth = mock(Auth);
		when(auth.authenticate("abc")).thenResolve(true);
		const authMock = instance(auth);
		const googleAuth = new GoogleAuth(authMock);

		const req = mockReq();
		const res = mockRes();
		const next = mockNext();

		await googleAuth.authenticate(req, res, next);

		expect(res.locals.authenticated).toBe(true);
	});

	it("should not authenticate", async () => {
		const auth = mock(Auth);
		when(auth.authenticate("abc")).thenReject(new Error());
		const authMock = instance(auth);
		const googleAuth = new GoogleAuth(authMock);

		const req = mockReq();
		const res = mockRes();
		const next = mockNext();

		await googleAuth.authenticate(req, res, next);

		expect(res.locals.authenticated).toBe(false);
	});
});

function mockReq() {
	return {
		...anything(),
		...{
			query: {
				code: "abc"
			},
			headers: {
				authorization: "abc"
			}
		}
	};
}

function mockRes() {
	return {
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
}

function mockNext() {
	return () => "";
}

function mockToken() {
	return {
		...{
			user: 1,
			accessToken: "qwe",
			accessTokenExpiresAt: anything(),
			clientId: anything(),
			tokenId: anything(),
			tokenType: anything(),
		},
		...anything()
	};
}