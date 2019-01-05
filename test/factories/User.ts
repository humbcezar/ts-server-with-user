import {User} from "../../src/Models/User";
import * as randomString from "randomstring";

export default function createUser(properties = {}) {
	const userModel = new User().getModelForClass(User);
	const user = new userModel({
		...{
			username: randomString.generate(12),
			email: randomString.generate(5) + "@" + randomString.generate(5) + ".com"
		},
		...properties
	});
	return user.save();
}