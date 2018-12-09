import { Request, Response } from "express";
import { Retrieval } from "../services/users/retrieval";
import { Creator } from "../services/users/creator";

export class UserController {

	private retrievalService: Retrieval;
	private creatorService: Creator;

	/**
	 * @param retrievalService
	 * @param creatorService
	 */
	constructor(
		retrievalService: Retrieval,
		creatorService: Creator
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
	show = async (req: Request, res: Response): Promise<void> => {
		try {
			const user = await this.retrievalService.retrieve(req.params.userName);
			res.send(user);
		} catch (err) {
			res.status(400).send(err.toString() + err.stack);
		}
	};

	/**
	 * Store user
	 *
	 * @param req
	 * @param res
	 */
	store = async(req: Request, res: Response): Promise<void> => {
		try {
			const user = await this.creatorService.create(req.body);
			res.send(user);
		} catch (err) {
			res.status(400).send(err.toString() + err.stack);
		}
	};
}

export default new UserController(new Retrieval(), new Creator());