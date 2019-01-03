import {InstanceType, instanceMethod, ModelType, plugin, prop, staticMethod, Typegoose} from "typegoose";

@plugin(require("mongoose-bcrypt"),  {
	fields: ["password"]
})
export class User extends Typegoose {
	@prop({
		unique: true,
		required: true
	})
	username: string;

	@prop({
		required: "Email address is required",
		unique: true,
		validate: {
			validator: (email) => {
				const re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
				return re.test(email);
			},
			message: "Please fill a valid email address"
		}
	})
	email: string;

	@prop({required: true})
	password: string;

	@prop()
	name: string;

	@prop()
	google_account_id: string;

	@instanceMethod
	show(this: InstanceType<User>) {
		return {
			id: this.id,
			username: this.username,
			email: this.email
		};
	}

	@staticMethod
	static getUserByEmail(this: ModelType<User> & typeof User, email: string) {
		return this.findOne({email})
			.exec();
	}
}