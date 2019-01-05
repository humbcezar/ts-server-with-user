import app from "./app";
import container from "./inversify.config";

const application = app(container);

const server = application.listen(application.get("port"), () => {
	console.log(
		"  App is running at http://localhost:%d in %s mode",
		application.get("port"),
		application.get("env")
	);
	console.log("  Press CTRL-C to stop\n");
});

export default server;