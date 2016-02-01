import World from "../World";
import {CommandRequestJSON, CommandResponseJSON} from "../commands/Command";
import ObjectUtils from "../utils/Object";

interface IController {
	getWorldState(): any ;
	receiveCommand(command: CommandRequestJSON): void;
}

class BaseController implements IController {

	protected world: World;
	private children: IController[];

	constructor(world: World) {
		this.world = world;
		this.children = [];
	}

	public addChildController(controller: IController): void {
		this.children.push(controller);
	}

	getWorldState(): any {
		var result = {};
		// Merge state from all children
		this.children.forEach((child: IController) => {
			var state = child.getWorldState();
			// TODO: merge state in result
			throw new Error("TODO: merge state in result.");
		});
	}

	receiveCommand(command: CommandRequestJSON): void {
		// Propagate command to children
		this.children.forEach((child: IController) => {
			child.receiveCommand(command);
		});
	}

	toString(): string {
		return (<any> this.constructor).name
			+"("+this.children.length+" children)";
	}

}

abstract class Controller extends BaseController implements IController {

	private parent: IController;

	constructor(world: World, parent: IController) {
		super(world);
		if (parent == null) {
			console.error("Null parent for controller '" + (<any> this.constructor).name + "'. "
				+"An error will be throw after dev is finished!");
			//throw new Error("Null parent for controller '" + (<any> this.constructor).name + "'.")
		}
		this.parent = parent;
	}

	abstract activate(now: number): void;
	abstract deactivate(now: number): void;

	/**
	 * Builds the state from the associated world.
	 */
	abstract getWorldState(): any ;

	abstract receiveCommand(command: CommandRequestJSON): void;

}

export default Controller;
export {BaseController};