import { IUser, User } from "../../models/user";

export class Creator {
	/**
	 * Create user
	 *
	 * @param userData
	 * @returns {*}
	 */
	create(userData): Promise<IUser> {
		const user = new User({
			username: userData.username,
			email: userData.email,
			password: userData.password
		});

		return user
			.save()
			.then(user => {
				return user.show();
			});
	}
}