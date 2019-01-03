import { Creator } from "../../../../src/Services/User/Creator";
import { User } from "../../../../src/Models/User";
import * as assert from "assert";
import { MongoError } from "mongodb";
import { Error } from "mongoose";
import "jest";
import "../../testBase";

describe("unit/Services/User/Creator.test.ts", () => {
	describe("create(userData)", () => {
		const userModel = new User().getModelForClass(User);

		afterAll(async () => {
			await userModel.deleteMany({});
		});

		const creator = new Creator(userModel);
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

		it("should not create user with invalid email", async () => {
			let error;
			userData.email = "invalidemail.com";
			try {
				await creator.create(userData);
			} catch (e) {
				error = e;
			}
			expect(error).toBeInstanceOf(Error.ValidationError);
			expect(error.toString()).toContain("address");
		});
	});
});