import { prop, Typegoose } from "typegoose";
import { Types } from "mongoose";

export class OAuth2Token extends Typegoose {
	@prop()
	userId: { type: Types.ObjectId, ref: "User" };

	@prop()
	clientId: any;

	@prop()
	accessToken: string;

	@prop()
	accessTokenExpiresOn: Date;

	@prop()
	refreshToken: string;

	@prop()
	refreshTokenExpiresOn: Date;
}