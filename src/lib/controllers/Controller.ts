import World from "../World";
import {CommandRequestJSON, CommandResponseJSON} from "../commands/Command";
import ObjectUtils from "../utils/Object";

export interface IController {
	getWorldState(): any ;
	doReceiveCommand(command: CommandRequestJSON): void;
	removeChildController(controller: IController): void;
	doDeactivate(now: number): void;
}

export class BaseController implements IController {

	protected world: World;
	private children: IController[];

	constructor() {
		this.world = null;
		this.children = [];
	}

	setWorld(world: World) {
		this.world = world;
	}

	/**
	 * Initializes a child component from its class.
	 * @param controller
	 */
	public addChildController(controller: BaseController): void {
	//public addChildController(controllerClass: new (world: World, parent: IController) => Controller): void {
		//var controller = new controllerClass(this.world, this);

		this.children.push(controller);
	}

	public removeChildController(controller: IController): void {
		var index = this.children.indexOf(controller);
		if (index == -1) {
			throw new Error("Child controller not found: "+controller.toString());
		}
		this.children.splice(index, 1);
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

	doReceiveCommand(command: CommandRequestJSON): void {
		// Propagate command to children
		this.children.forEach((child: IController) => {
			child.doReceiveCommand(command);
		});
	}

	doDeactivate(now: number): void {
		this.children.forEach((child: IController) => {
			child.doDeactivate(now);
		});
	}

	toString(): string {
		return (<any> this.constructor).name
			+"("+this.children.length+" children)";
	}

}

abstract class Controller extends BaseController implements IController {

	private parent: IController;

	constructor() {
		super();
	}

	/**
	 * Initializes a child component from its class.
	 * @param controller
	 */
	public addChildController(controller: Controller): void {
		//public addChildController(controllerClass: new (world: World, parent: IController) => Controller): void {
		//var controller = new controllerClass(this.world, this);

		super.addChildController(controller);
		controller.setContext(this.world, this);
		controller.doActivate(this.world.now);
	}

	setContext(world: World, parent: IController) {
		this.setWorld(world);
		if (parent == null) {
			console.error("Null parent for controller '" + (<any> this.constructor).name + "'. "
				+"An error will be throw after dev is finished!");
			//throw new Error("Null parent for controller '" + (<any> this.constructor).name + "'.")
		}
		this.parent = parent;
	}

	doActivate(now: number): void {
		this.activate(now);
	}

	doDeactivate(now: number): void {
		this.deactivate(now);
		super.doDeactivate(now);

		console.warn("TODO: we have to check that parent is not null because we are using a custom Controller as the" +
			" RootController... Please fix this sometime.");

		if (this.parent) {
			this.parent.removeChildController(this);
		}
	}

	doReceiveCommand(command: CommandRequestJSON): void {
		// Local processing
		this.receiveCommand(command);

		// Propagate to children
		super.doReceiveCommand(command);
	}

	protected abstract activate(now: number): void;
	protected abstract deactivate(now: number): void;

	/**
	 * Builds the state from the associated world.
	 */
	abstract getWorldState(): any ;

	protected abstract receiveCommand(command: CommandRequestJSON): void;

}

export default Controller;