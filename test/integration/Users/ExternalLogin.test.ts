import "../../testBase";
import "jest";
import app from "../../../src/app";
import container from "../../../src/inversify.config";
import {createHeader} from "../../utils";
import request = require("supertest");
import {Auth} from "../../../src/Services/GoogleClient/Auth";
import {anything} from "ts-mockito";

describe("test/integration/Users/ExternalLogin.test", () => {
	it("should login", async () => {
		container.rebind(Auth).toConstantValue({
			...anything(),
			...{
				token(arg) {
					return "called with " + arg;
				}
			}
		});
		const response = await request(app(container))
			.get("/api/users/external/login")
			.set(createHeader())
			.query({code: "abc"});
		expect(response.status).toBe(200);
		expect(response.text).toBe("called with abc");
	});

	it("should not login", async () => {
		container.rebind(Auth).toConstantValue({
			...anything(),
			...{
				token(arg) {
					throw new Error();
				}
			}
		});
		const response = await request(app(container))
			.get("/api/users/external/login")
			.set(createHeader())
			.query({code: "abc"});
		expect(response.status).toBe(400);
		expect(response.text).toBe("Invalid credentials");
	});
});