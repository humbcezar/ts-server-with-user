import { User } from "../../Models/User";
import { inject, injectable } from "inversify";
import { ModelType } from "typegoose";
import "reflect-metadata";

@injectable()
export class Creator {
	private userModel: ModelType<User>;

	constructor(@inject(User) userModel: ModelType<User>) {
		this.userModel = userModel;
	}

	/**
	 * Create user
	 *
	 * @param userData
	 * @returns Promise<any>
	 */
	create(userData): Promise<any> {

		const user = new this.userModel({
			username: userData.username,
			email: userData.email,
			password: userData.password,
			google_account_id: userData.google_account_id ? userData.google_account_id : ""
		});

		return user
			.save()
			.then(user => {
				return user.show();
			});
	}
}