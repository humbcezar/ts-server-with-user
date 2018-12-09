import { IUser, User } from "../../models/user";


export class Retrieval {
	/**
	 * Retrieves user
	 *
	 * @param userName
	 * @returns {Promise<IUser>}
	 */
	retrieve(userName: string): Promise<IUser> {
		return User.findOne({username: userName})
			.exec()
			.then(user => {
				if (user) {
					return user.show();
				}
				return undefined;
			});
	}
}