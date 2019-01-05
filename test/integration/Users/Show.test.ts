import "../../testBase";
import "jest";
import * as randomString from "randomstring";
import createUser from "../../factories/User";
import app from "../../../src/app";
import {createHeader} from "../../utils";
import request = require("supertest");
import container from "../../../src/inversify.config";

describe("test/integration/Users/Show.test.ts", () => {
	it("should show user", async () => {
		const password = randomString.generate(12);
		const user = await createUser({password});
		const response = await request(app(container))
			.get("/api/users/" + user.username)
			.set(createHeader())
			.send({username: user.username, password: password});
		const {id, username, email} = user;
		expect(response.status).toBe(200);
		expect(JSON.parse(response.text)).toMatchObject({id, username, email});
	});

	it("should not show user", async() => {
		const response = await request(app(container))
			.get("/api/users/aaa")
			.set(createHeader());
		expect(response.status).toBe(404);
		expect(response.text).toBe("User not found");
	});
});
