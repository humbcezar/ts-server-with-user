import { instanceMethod, plugin, prop, Typegoose } from "typegoose";

@plugin(require("mongoose-bcrypt"),  {
	fields: ["password"]
})
export class User extends Typegoose {
	@prop({
		required: true,
		unique: true
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

	@prop({
		required: true
	})
	password: string;

	@instanceMethod
	show() {
		return {
			username: this.username,
			email: this.email
		};
	}
}