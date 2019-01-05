import "../../testBase";
import "jest";
import app from "../../../src/app";
import request = require("supertest");
import * as randomString from "randomstring";
import createUser from "../../factories/User";
import {createHeader} from "../../utils";

describe("test/integration/Users/Login.test", () => {
	it("should login", async () => {
		const password = randomString.generate(12);
		const user = await createUser({password});
		const response = await request(app)
			.post("/api/users/login")
			.set(createHeader())
			.type("form")
			.send({username: user.username, password: password});
		expect(response.status).toBe(200);
	});

	it("should not login", async () => {
		const response = await request(app).post("/api/users/login");
		expect(response.status).toBe(400);
		expect(response.text).toBe("Invalid credentials");
	});
});