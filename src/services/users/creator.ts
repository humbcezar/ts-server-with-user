import { IUser, User } from "../../models/user";
import { injectable } from "inversify";
import "reflect-metadata";

@injectable()
export class Creator {
	/**
	 * Create user
	 *
	 * @param userData
	 * @returns Promise<IUser>
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