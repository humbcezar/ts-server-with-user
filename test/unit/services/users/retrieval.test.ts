import { Retrieval } from "../../../../src/services/users/retrieval";
import { User } from "../../../../src/models/user";
import * as assert from "assert";
require("../../testBase");

describe("unit/services/users/retrieval.test.ts", async () => {
	describe("retrieve(userData)", () => {
		const retrieval = new Retrieval();
		const userData = {
			username: "TestUser",
			email: "valid@email.com",
			password: "testPassword"
		};

		afterAll(async () => {
			await User.deleteMany({});
		});

		it("should retrieve a user", async () => {
			await (new User(userData)).save();

			const user = await retrieval.retrieve(userData.username);
			assert.deepStrictEqual({
				username: userData.username,
				email: userData.email
			}, {
				username: user.username,
				email: user.email
			});
		});

		it("should return undefined if user do not exists", async () => {
			const user = await retrieval.retrieve("none");
			expect(user).toEqual(undefined);
		});
	});
});