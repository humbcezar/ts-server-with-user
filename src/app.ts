import * as express from "express";
import * as compression from "compression";
import logger from "./util/logger";
import * as morgan from "morgan";
import * as mongoose from "mongoose";
import router from "./routes/api";
import * as errorHandler from "errorhandler";
import * as dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.DB_HOST, {
	useNewUrlParser: true,
	dbName: process.env.DB_DATABASE
})
.then(() => {
	logger.debug("DB successfully connected: " + process.env.DB_HOST + "/" + process.env.DB_DATABASE);
})
.catch((err) => {
	logger.debug(err.toString(), {stack: err.stack});
});

const app = express();

app.set("port", process.env.PORT || 3000);

if (process.env.ENVIRONMENT == "dev") {
	app.use(morgan("dev"));
	app.use(errorHandler());
}

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);

export default app;