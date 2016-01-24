import IComponent from "./components/IComponent";
import World from "./World";
import EntityType from "./EntityType";
import ComponentBag from "./components/ComponentBag";
import loadPropertiesValues from "./utils/PropertyLoader";

export {EntityType};
export default class Entity extends ComponentBag {

	private static guidAutoIncrement = 1;
	private guid:number;
	private type:EntityType;
	private world:World;

	constructor(world:World, type:EntityType) {
		super();
		if (type == null) {
			throw new Error("Entity type can't be null.");
		}
		this.guid = Entity.guidAutoIncrement++;
		this.type = type;
		this.world = world;
	}

	public getGUID():number {
		return this.guid;
	}

	despawn():void {
		this.world.removeEntity(this);
	}

	getState():any {
		var state = super.getState();
		state.guid = this.guid;
		state.type = this.type.getData();

		loadPropertiesValues(this, state);

		return state;
	}

	getType():EntityType {
		return this.type;
	}

	getTypeName():string {
		return (<any> this.constructor).name;
	}

	toString():string {
		return this.getTypeName() + "#" + this.guid;
	}
}