import { Retrieval } from "../../../../src/Services/User/Retrieval";
import { User } from "../../../../src/Models/User";
import * as assert from "assert";
import "jest";
import "../../../testBase";

describe("unit/Services/User/Retrieval.test.ts", async () => {
	describe("retrieve(userData)", () => {
		const userModel = new User().getModelForClass(User);
		const retrieval = new Retrieval(userModel);
		const userData = {
			username: "TestUser",
			email: "valid@email.com",
			password: "testPassword"
		};

		afterEach(async () => {
			await userModel.deleteMany({});
		});

		it("should retrieve a user", async () => {
			await (new userModel(userData)).save();

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