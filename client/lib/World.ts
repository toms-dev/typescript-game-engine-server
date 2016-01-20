import Entity from "./Entity";
//import EntityType from "./EntityType";
import Vector3 from "./math/Vector3";
import Movement from "./components/common/Movement";

export default class World {

	private entities:Entity[];

	constructor() {
		this.entities = [];
	}

	getEntity(id:number):Entity {
		for (var i = 0; i < this.entities.length; ++i) {
			var e = this.entities[i];
			if (e.guid == id) return e;
		}
		return null;
	}

	getEntities():Entity[] {
		return this.entities;
	}

	processServerState(worldData:any):void {
		var entities = worldData.entities;

		for (var i = 0; i < entities.length; ++i) {
			var entityData = entities[i];
			var entity = this.getEntity(entityData.guid);
			if (entity == null) {
				this.spawnEntity(entityData);
			} else {
				entity.loadState(entityData);
			}
		}

		var entitiesToDespawn = worldData.entitiesToDespawn;
		for (var i = 0; i < entitiesToDespawn.length; ++i) {
			var entityID = entitiesToDespawn[i];
			this.removeEntityByID(entityID);
		}
	}

	public tick(delta: number, now: number): void {
		for (var i = 0; i < this.entities.length; i++) {
			var entity = this.entities[i];
			entity.tick(delta, now);
		}
	}

	private spawnEntity(entityData: any):Entity {
		console.log("Spawning from data:", entityData);

		var entityType = entityData.type;

		// TODO: [META] Find the class to instantiate from their declaration via decorators
		/*var typeMapping:any = {};

		typeMapping[EntityType.BOARDS] = Boards;
		typeMapping[EntityType.BULLET] = Bullet;
		typeMapping[EntityType.SHIP] = Ship;

		var EntityClass:new () => Entity = typeMapping[entityType];


		var e = new EntityClass();*/
		var e = new Entity();

		e.loadState(entityData);
		this.entities.push(e);
		console.log("Spawned entity:", e);
		return e;
	}

	getClosestEntityNear(coords:Vector3, additionalFilter?: (ent: Entity) => boolean) {
		var bestDist = Infinity,
			bestEntity: Entity = null;
		/*console.log("Nearest: ", coords);
		 console.log("Entities:", this.entities);*/
		this.entities.forEach((entity:Entity) => {
			if (additionalFilter) {
				if (! additionalFilter(entity)) return;
			}
			console.log("Filter match:", entity);
			var movement:Movement = entity.getComponent(Movement);
			var dist = movement.getPosition().to(coords).norm();
			if (dist < bestDist) {
				bestDist = dist;
				bestEntity = entity;
				//console.log("New best:", bestEntity.guid, '@', bestDist);
			}
		});
		return {
			entity: bestEntity,
			distance: bestDist
		};
	}

	private removeEntityByID(entityID:number):void {
		var ent = this.getEntity(entityID);
		var index = this.entities.indexOf(ent);
		if (index != -1) {
			this.entities.splice(index, 1);
		}
	}
}
