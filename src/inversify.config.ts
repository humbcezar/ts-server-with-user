import { Container } from "inversify";
import { Creator } from "./services/users/creator";
import { Retrieval } from "./services/users/retrieval";
import { UserController } from "./controllers/userController";
import { ApiRouter } from "./routes/api";

const container = new Container();
container.bind(UserController).toSelf();
container.bind(Creator).toSelf();
container.bind(Retrieval).toSelf();
container.bind(ApiRouter).toSelf();

export default container;