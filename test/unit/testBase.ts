require("dotenv").config();
import * as mongoose from "mongoose";

beforeEach(async() => {
	if (mongoose.connection.readyState == 0) {
		await mongoose.connect(process.env.DB_HOST, {
			useNewUrlParser: true,
			dbName: process.env.DB_TEST_DATABASE
		});
	}
});
