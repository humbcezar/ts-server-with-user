import { User } from "../../Models/User";
import { inject, injectable } from "inversify";
import { ModelType } from "typegoose";
import "reflect-metadata";

@injectable()
export class Retrieval {
	private userModel: ModelType<User>;

	constructor(@inject(User) userModel: ModelType<User>) {
		this.userModel = userModel;
	}
	/**
	 * Retrieves user
	 *
	 * @param userName
	 * @returns {Promise<any>}
	 */
	retrieve(userName: string): Promise<any> {
		return this.userModel.findOne({username: userName})
			.exec()
			.then(user => {
				if (user) {
					return user.show();
				}
				return undefined;
			});
	}
}