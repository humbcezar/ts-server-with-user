import "../testBase";
import "jest";
import { UserController } from "../../../src/Controllers/UserController";
import { anything, instance, mock, verify, when } from "ts-mockito";
import { Retrieval } from "../../../src/Services/User/Retrieval";
import { Creator } from "../../../src/Services/User/Creator";
const mockReqRes = require("mock-req-res");
import { Error } from "mongoose";

describe("unit/Controllers/UserController.test.ts", () => {

	it("should show user", async () => {
		const retrieval = mock(Retrieval);
		const retrievalMock = instance(retrieval);
		const creatorMock = instance(mock(Creator));
		const requestMock = mockReqRes.mockRequest();
		const responseMock = mockReqRes.mockResponse();

		const userController = new UserController(retrievalMock, creatorMock);
		const user = await userController.show(requestMock, responseMock);
		verify(retrieval.retrieve(anything())).called();

		expect(user).toEqual(undefined);

	});

	it("should create user", async () => {
		const retrievalMock = instance(mock(Retrieval));
		const creator = mock(Creator);
		const creatorMock = instance(creator);
		const requestMock = mockReqRes.mockRequest();
		const responseMock = mockReqRes.mockResponse();

		const userController = new UserController(retrievalMock, creatorMock);
		await userController.store(requestMock, responseMock);

		verify(creator.create(anything())).called();

	});

	it("should not create user", async () => {
		const retrievalMock = instance(mock(Retrieval));
		const creator = mock(Creator);
		when(creator.create(anything())).thenReject(new Error.ValidationError(anything()));
		const creatorMock = instance(creator);
		const requestMock = mockReqRes.mockRequest();
		const responseMock = mockReqRes.mockResponse({
			status: () => this,
			send: () => "Username or email already exists."
		});

		const userController = new UserController(retrievalMock, creatorMock);
		const response = await userController.store(requestMock, responseMock);

		expect(response).toEqual("Username or email already exists.");

	});

});