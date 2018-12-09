import * as winston from "winston";

const formatter = winston.format.printf(info => {
	if (info.stack) {
		return new Date(info.timestamp) + "\n" + info.stack;
	}
	return new Date(info.timestamp) + "\n" + info.message;
});

const logger = winston.createLogger({
	transports: [
		new (winston.transports.Console)({
			level: process.env.NODE_ENV === "production" ? "error" : "debug",
			format: winston.format.combine(
				winston.format.timestamp(),
				formatter
			)
		}),
		new (winston.transports.File)({
			filename: "debug.log",
			level: "debug",
			format: winston.format.combine(
				winston.format.timestamp(),
				formatter
			)
		})
	]
});

if (process.env.NODE_ENV !== "production") {
	logger.debug("Logging initialized at debug level");
}

export default logger;