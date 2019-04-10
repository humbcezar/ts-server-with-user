import * as express from "express";
import * as compression from "compression";
import logger from "./Util/logger";
import * as morgan from "morgan";
import * as mongoose from "mongoose";
import * as errorHandler from "errorhandler";
import * as dotenv from "dotenv";
import { ApiRouter } from "./Routes/ApiRouter";
import {interfaces} from "inversify";
import Container = interfaces.Container;


export default function app(container: Container) {
	dotenv.config();

	if (mongoose.connection.readyState == 0) {
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
	}

	const router = container.get<ApiRouter>(ApiRouter);

	const app = express();
	app.set("port", process.env.PORT || 3000);

	if (process.env.ENVIRONMENT == "dev") {
		app.use(morgan("dev"));
		app.use(errorHandler());
	}

	app.use(function (req, res, next) {
		// Website you wish to allow to connect
		res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);

		// Request methods you wish to allow
		res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

		// Request headers you wish to allow
		res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type,authorization");

		// Pass to next layer of middleware
		next();
	});

	app.use(compression());
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use("/api", router.getRouter());

	return app;
}