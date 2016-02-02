import IComponent from "./components/IComponent";
import World from "./World";
import EntityType from "./EntityType";
import ComponentBag from "./components/ComponentBag";
import NamedEntityType from "./NamedEntityType";

import DecorationContext from "./decorators/DecorationContext";

import {loadPropertiesValues} from "./utils/PropertyLoader";

export {EntityType};
export default class Entity extends ComponentBag {

	private static guidAutoIncrement = 1;
	private _guid:number;
	private type:EntityType;
	private world:World;

	private static instances: {[guid: number]: Entity} = {};

	constructor(type:EntityType = null) {
		super();
		type = new NamedEntityType((<any> this.constructor).name);
		if (type == null) {
			throw new Error("Entity type can't be null.");
		}
		this.guid = Entity.guidAutoIncrement++;
		this.type = type;
		this.world = null;
	}

	// Update the instances registry whenever updating the GUID ;)
	set guid(value: number) {
		Entity.instances[this._guid] = null;
		this._guid = value;
		Entity.instances[this._guid] = this;
	}

	setWorld(world: World): void {
		this.world = world;
	}

	public getGUID():number {
		return this._guid;
	}

	despawn():void {
		this.world.removeEntity(this);
	}

	getState():any {
		var state = super.getState();
		state.guid = this._guid;
		state.type = this.type.getData();

		loadPropertiesValues(this, state);

		return state;
	}

	static deserialize(state: any, resolver: DecorationContext): Entity|Entity[] {
		if (state == null) {
			return null
		}
		if (Array.isArray(state)) {
			var result: Entity[] = [];
			state.forEach((subState: any) => {
				// In the case of a subEntity, we are sure that we'll only get single entity for the Entity.deserialize
				// method, hence the cast.
				result.push(<Entity> Entity.deserialize(subState, resolver));
			});
			return result;
		}

		var entity: Entity;
		// If an ID is provided, retrieve from existing instance
		if (typeof state == "number") {
			entity = Entity.instances[state];
			if (!entity) {
				//throw new Error("Entity with GUID '"+state+"' has not been instantiated yet.");
				console.warn("Entity with GUID '"+state+"' has not been instantiated yet.");
				entity = null;
			}
		}
		// or rebuild from data
		else {
			// Instantiate from the type name
			if (state.type.metaType == "namedType") {
				var typeName = state.type.typeData.name;
				var entityClass = resolver.resolveEntity(typeName);
				entity = new entityClass();
			}
			else {
				throw new Error("Unsupported metaType: "+state.type.metaType);
			}
		}
		// Rebuild/update from state
		if (entity != null) {	// TODO: THIS IS A DEBUG CHECK! Remove it when pre-instantiation is implemented!
			entity.fromState(state, resolver);
		}

		return entity;
	}

	fromState(state: any, resolver: DecorationContext): any {
		this._guid = state.guid;
		this.type = null; // TODO: type.fromState()

		var log = false;
		if (log) console.log("Input state: ", state);

		// Load properties
		// Sub entities
		var subEntities: any = state.entities;
		for (var entityKey in subEntities) {
			if (! subEntities.hasOwnProperty(entityKey)) continue;

			var subEntityData = subEntities[entityKey];
			var existingSubEntity: Entity | Entity[] = (<any> this)[entityKey];

			// Fully deserialize if no entity already exists or if the collection is empty
			if (! existingSubEntity || (<any[]> existingSubEntity).length == 0) {
				var subEntity = Entity.deserialize(subEntityData, resolver);
				if (log) console.log("Parsed "+entityKey+": ", subEntity);

				// Safety check if getters/setters are used.
				if (this.constructor.prototype.__lookupGetter__(entityKey)) {
					if (! this.constructor.prototype.__lookupSetter__(entityKey)) {
						entityKey = "_"+entityKey;
						if ((<any>this)[entityKey] == undefined) {
							throw new Error("Missing setter for " + (<any> this.constructor).name + "." + entityKey+". (also searched with underscore prefix)" );
						}
					}
				}
			}
			else {
				if (log) console.log("Using existing entity instance for "+entityKey+":", existingSubEntity);
				// Handle collections
				if (Array.isArray(existingSubEntity)) {
					// Update all the entities in the collection
					(<Entity[]> existingSubEntity).forEach((e: Entity) => {
						e.fromState(subEntityData, resolver);
					})
				}
				// Nullify value
				else if (subEntityData == null) {
					existingSubEntity = null;
				}
				// Handle single values
				else {
					(<Entity> existingSubEntity).fromState(subEntityData, resolver);
				}
				subEntity = existingSubEntity;
			}
			(<any> this)[entityKey] = subEntity;
		}

		// Raw properties
		// Replace all raw properties (no in-place update like entities)
		var properties: any = state.properties;
		for (var propertyKey in properties) {
			if (! properties.hasOwnProperty(propertyKey)) continue;

			var propertyValue = properties[propertyKey];
			if (log) console.log("Raw "+propertyKey+": ", propertyValue);
			(<any> this)[propertyKey] = propertyValue;
		}
	}

	getType():EntityType {
		return this.type;
	}

	getTypeName():string {
		return (<any> this.constructor).name;
	}

	toString():string {
		return this.getTypeName() + "#" + this._guid;
	}

	receiveEvent(eventName: string, args: any[]): void {
		console.warn("TODO: Replace the event propagation plz?");
		super.receiveEvent(eventName, args);
	}

	public getSubEntity<T extends Entity>(entities: T[], entityID: number): T {
		for (var i = 0; i < entities.length; ++i) {
			var ent = entities[i];
			if (ent.getGUID() == entityID) {
				return ent;
			}
		}
		return null;
	}
}