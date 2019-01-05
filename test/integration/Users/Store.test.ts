import "../../testBase";
import "jest";
import app from "../../../src/app";
import {createHeader} from "../../utils";
import request = require("supertest");
import * as randomString from "randomstring";

describe("test/integration/Users/Store.test.ts", () => {
	it("should store user", async() => {
		const user = {
			username: randomString.generate(10),
			password: randomString.generate(10),
			email: randomString.generate(5) + "@" + randomString.generate(5) + ".com"
		};
		const response = await request(app)
			.post("/api/users")
			.set(createHeader())
			.send(user);
		expect(response.status).toBe(201);
		expect(response.text).toContain(user.username);
	});

	it("should not store user", async () => {
		const response = await request(app)
			.post("/api/users")
			.set(createHeader());
		expect(response.status).toBe(400);
		expect(response.text).toBe("Invalid username or email.");
	});
});