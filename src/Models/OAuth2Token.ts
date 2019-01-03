import {ModelType, prop, Ref, staticMethod, Typegoose} from "typegoose";
import {User} from "./User";

export class OAuth2Token extends Typegoose {
	@prop({ ref: User, required: true })
	user: Ref<User> & User;

	@prop()
	clientId: any;

	@prop()
	accessToken: string;

	@prop()
	accessTokenExpiresAt: Date;

	@prop()
	refreshToken: string;

	@prop()
	refreshTokenExpiresAt: Date;

	@prop()
	tokenId: string;

	@prop()
	tokenType: string;

	@staticMethod
	static updateOrCreate(
		this: ModelType<OAuth2Token> & typeof OAuth2Token,
		conditions: any,
		data: any
	) {
		return this.findOneAndUpdate(
			conditions,
			data,
			{upsert: true, new: true, runValidators: true}
		);
	}
}