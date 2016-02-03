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
		for (var sourceEntityKey in subEntities) {
			if (! subEntities.hasOwnProperty(sourceEntityKey)) continue;

			// Target entity key might be modified if a setter is not found.
			var targetEntityKey = sourceEntityKey;

			// Safety check to prevent missing setter...
			if (this.constructor.prototype.__lookupGetter__(sourceEntityKey)) {
				if (! this.constructor.prototype.__lookupSetter__(sourceEntityKey)) {
					console.warn("Missing setter for " + (<any> this.constructor).name + "." + sourceEntityKey+"");
					// Add an underscore to find hidden property
					targetEntityKey = "_"+targetEntityKey;
					if ((<any>this)[targetEntityKey] == undefined) {
						throw new Error("Missing setter for " + (<any> this.constructor).name + "." + sourceEntityKey+". (also searched with underscore prefix)" );
					}
				}
			}

			var subEntityData = subEntities[sourceEntityKey];
			var existingSubEntity: Entity | Entity[] = (<any> this)[sourceEntityKey];

			// Fully deserialize if no entity already exists or if the collection is empty
			if (! existingSubEntity || (<any[]> existingSubEntity).length == 0) {
				var subEntity = Entity.deserialize(subEntityData, resolver);
				if (log) console.log("Parsed "+sourceEntityKey+": ", subEntity);
			}
			// Otherwise, only update the entity
			else {
				if (log) console.log("Using existing entity instance for "+sourceEntityKey+":", existingSubEntity);
				// Handle collections
				if (Array.isArray(existingSubEntity)) {
					// Update all the entities in the collection
					var subEntitiesData: any[] = subEntityData;
					var newSubEntities: Entity[] = [];
					subEntitiesData.forEach((singleEntityData: any) => {
						// If we only have the GUID of the Entity, just preserve the entity.
						var entity: Entity;
						if (typeof singleEntityData == "number") {
							// In this case, do not load anything, but be sure that the new list of entities is updated!
							var guid = singleEntityData;
							entity = Entity.instances[guid];
						}
						// Otherwise, update the entity
						else {
							var guid = singleEntityData.guid;
							entity = Entity.instances[guid];
							if (entity) {
								entity.fromState(singleEntityData, resolver);
							}
							else {
								// Here, we are sure to only get a single Entity from the deserialize method.
								entity = <Entity> Entity.deserialize(singleEntityData, resolver);
							}
						}
						newSubEntities.push(entity);
					});
					// Propagate the result to store it
					existingSubEntity = newSubEntities;
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

			(<any> this)[targetEntityKey] = subEntity;
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