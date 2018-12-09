import { Creator } from "../../../../src/services/users/creator";
import { User } from "../../../../src/models/user";
import * as assert from "assert";
import { MongoError } from "mongodb";
require("../../testBase");

describe("unit/services/users/creator.test.ts", () => {
	describe("create(userData)", () => {
		afterAll(async () => {
			await User.deleteMany({});
		});

		const creator = new Creator();
		const userData = {
			username: "TestUser",
			email: "valid@email.com",
			password: "testPassword"
		};
		it("should create a user", async () => {
			const user = await creator.create(userData);
			assert.deepStrictEqual({
				username: userData.username,
				email: userData.email
			}, {
				username: user.username,
				email: user.email
			});
		});

		it("should not create user with repeated username", async () => {
			let error;
			userData.email = "asdf@asdf.com";
			try {
				await creator.create(userData);
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(MongoError);
			expect(error.toString()).toContain("duplicate key");
		});

		it("should not create user with repeated email", async () => {
			let error;
			userData.email = "valid@email.com";
			try {
				await creator.create(userData);
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(MongoError);
			expect(error.toString()).toContain("duplicate key");
		});
	});
});