import { Request, Response } from "express";
import { Retrieval } from "../services/users/retrieval";
import { Creator } from "../services/users/creator";
import { injectable, inject } from "inversify";
import "reflect-metadata";
import { Error } from "mongoose";

@injectable()
export class UserController {

	private retrievalService: Retrieval;
	private creatorService: Creator;

	/**
	 * @param retrievalService
	 * @param creatorService
	 */
	constructor(
		@inject(Retrieval) retrievalService: Retrieval,
		@inject(Creator) creatorService: Creator
	) {
		this.retrievalService = retrievalService;
		this.creatorService = creatorService;
	}

	/**
	 * Show user
	 *
	 * @param req
	 * @param res
	 */
	show = async (req: Request, res: Response): Promise<Response> => {
		try {
			const user = await this.retrievalService.retrieve(req.params.userName);
			return res.send(user);
		} catch (err) {
			return res.status(400).send(err.toString() + err.stack);
		}
	};

	/**
	 * Store user
	 *
	 * @param req
	 * @param res
	 */
	store = async(req: Request, res: Response): Promise<any> => {
		try {
			const user = await this.creatorService.create(req.body);
			return res.send(user);
		} catch (err) {
			if (err instanceof Error.ValidationError) {
				return res.status(400).send("Username or email already exists.");
			}
			return res.status(400).send(err.toString() + err.stack);
		}
	};
}