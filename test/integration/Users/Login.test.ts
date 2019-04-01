import "../../testBase";
import "jest";
import app from "../../../src/app";
import request = require("supertest");
import * as randomString from "randomstring";
import createUser from "../../factories/User";
import {createHeader} from "../../utils";
import container from "../../../src/inversify.config";

describe("test/integration/Users/Login.test", () => {
	it("should login with username", async () => {
		const password = randomString.generate(12);
		const user = await createUser({password});
		const response = await request(app(container))
			.post("/api/users/login")
			.set(createHeader())
			.type("form")
			.send({username: user.username, password: password});
		expect(response.status).toBe(200);
	});

	it("should login with email", async () => {
		const password = randomString.generate(12);
		const user = await createUser({password});
		const response = await request(app(container))
			.post("/api/users/login")
			.set(createHeader())
			.type("form")
			.send({username: user.email, password: password});
		expect(response.status).toBe(200);
	});

	it("should not login", async () => {
		const response = await request(app(container)).post("/api/users/login");
		expect(response.status).toBe(400);
		expect(response.text).toBe("Invalid credentials");
	});

	it("should not login with wrong username", async () => {
		const password = randomString.generate(12);
		const user = await createUser({password});
		const response = await request(app(container))
			.post("/api/users/login")
			.set(createHeader())
			.type("form")
			.send({username: user.username + "ast", password: password});
		expect(response.status).toBe(400);
	});

	it("should not login with wrong email", async () => {
		const password = randomString.generate(12);
		const user = await createUser({password});
		const response = await request(app(container))
			.post("/api/users/login")
			.set(createHeader())
			.type("form")
			.send({username: user.email + "ast", password: password});
		expect(response.status).toBe(400);
	});
});