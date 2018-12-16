import { Container } from "inversify";
import { Creator } from "./Services/User/Creator";
import { Retrieval } from "./Services/User/Retrieval";
import { UserController } from "./Controllers/UserController";
import { ApiRouter } from "./Routes/ApiRouter";
import { OAuth2Server } from "./Middlewares/OAuth2Server";
import { OAuth2Token } from "./Models/OAuth2Token";
import { User } from "./Models/User";
import { OAuth2Model } from "./Models/OAuth2Model";
import * as OriginalOAuth2Server from "oauth2-server";

const container = new Container();
container.bind(UserController).toSelf();
container.bind(Creator).toSelf();
container.bind(Retrieval).toSelf();
container.bind(ApiRouter).toSelf();
container.bind(OAuth2Server).toSelf();
container.bind(OAuth2Model).toSelf();
container.bind(OAuth2Token).toConstantValue(new OAuth2Token().getModelForClass(OAuth2Token));
container.bind(User).toConstantValue(new User().getModelForClass(User));
container.bind("OriginalOAuth2Server").toConstantValue(
	new OriginalOAuth2Server({
		model: container.get<OAuth2Model>(OAuth2Model),
		requireClientAuthentication: {password: false}
	})
);

export default container;