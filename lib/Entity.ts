
import IComponent from "./components/IComponent";
import World from "./World";
import EntityType from "./EntityType";
import * as EntityProperty from "./decorators/metamodel/EntityProperty";

export {EntityType};
export default class Entity {

	private static guidAutoIncrement = 1;
	private guid: number;
	private type: EntityType;
	private world: World;

	protected components: IComponent[];

	constructor(world: World, type: EntityType) {
		this.guid = Entity.guidAutoIncrement++;
		this.type = type;
		this.world = world;
		this.components = [];
	}

	public getGUID():number {
		return this.guid;
	}

	public addComponent(component: IComponent):void {
		this.components.push(component);
	}

	despawn(): void {
		this.world.removeEntity(this);
	}

	tick(delta: number, now: number) {
		for (var i = 0; i < this.components.length; ++i) {
			var comp = this.components[i];
			comp.tick(delta, now);
		}
	}

	getState(): any {
		var state: any = {};
		state.guid = this.guid;
		state.type = this.type;

		// Add data from public properties
		var properties = Reflect.getMetadata("properties", this.constructor);
		var i: number;
		for (i = 0; i < properties.length; i++) {
			var entityProp: EntityProperty.BaseClass = properties[i];
			// Check that the property is enabled client-side.
			if (entityProp.clientSide) {
				// Dynamically retrieve the property value
				state[entityProp.name] = (<any> this)[entityProp.name];
			}
		}

		// Add data from components
		for (var i = 0; i < this.components.length; ++i) {
			var cState = this.components[i].getState();
			for (var prop in cState) {
				if (! cState.hasOwnProperty(prop)) continue;
				state[prop] = cState[prop];
			}
		}
		return state;
	}

	/**
	 * Returning null can be a way to perform different logic but it should always be explicit to prevent null pointer
	 * exceptions.
	 * @param constructor
	 * @returns {any}
	 */
	getComponentOrNull<T>(constructor: new(...args: any[]) => T): T{
		for (var i in this.components) {
			if (! this.components.hasOwnProperty(i)) continue;
			var c: any = this.components[i];
			if (c instanceof constructor) {
				return c;
			}
		}
		return null;
	}

	getComponent<T>(constructor: new(...args: any[]) => T): T {
		var c = this.getComponentOrNull(constructor);
		if (c == null) {
			throw new Error("No component "+(<any>constructor).name+" found in "+this+".");
		}
		return c;
	}

	hasComponent<T>(constructor: new(...args: any[]) => T): boolean {
		return this.getComponentOrNull(constructor) != null;
	}

	getType():EntityType {
		return this.type;
	}

	getTypeName(): string {
		return this.type.value;
	}

	toString(): string {
		return this.getTypeName()+"#"+this.guid;
	}
}