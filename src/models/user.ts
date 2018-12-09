import * as mongoose from "mongoose";

export interface IUser extends mongoose.Document {
	username: string;
	email: string;
	password: string;
	show(): this;
}

const validateEmail = function(email) {
	const re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
	return re.test(email);
};

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		index: {
			unique: true
		},
		trim: true
	},
	email: {
		type: String,
		required: "Email address is required",
		trim: true,
		lowercase: true,
		unique: true,
		validate: [validateEmail, "Please fill a valid email address"],
		match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"]
	},
	password: {
		type: String,
		required: true,
		bcrypt: true
	}
});

/**
 * Show user information hiding password
 *
 * @returns {{_id: *, username: *, email: *}}
 */
userSchema.methods.show = function() {
	return {
		_id: this.id,
		username: this.username,
		email: this.email
	};
};

userSchema.plugin(require("mongoose-bcrypt"));

export const User: mongoose.Model<IUser> = mongoose.model<IUser>("User", userSchema);