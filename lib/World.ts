import Entity from "./Entity";
import Vector3 from "./math/Vector3";
import Map from "./Map";

// TODO: massive refactor to make this flexible as a real game engine would be...
export default class World {

	private entities:Entity[];
	private entitiesToDespawn: Entity[];

	constructor() {
		this.entities = [];
		this.entitiesToDespawn = [];
	}

	public loadMap(mapClass: new () => Map): void {
		var mapInstance = new mapClass();
		mapInstance.setup();
		mapInstance.entities.forEach((entity: Entity) => {
			this.addEntity(entity);
		})
	}

	public tick(delta:number, now: number) {
		for (var i = 0; i < this.entities.length; ++i) {
			var e = this.entities[i];
			e.tick(delta, now);
		}
	}


	cleanUpPostTick():void {
		this.entitiesToDespawn = [];
	}

	addEntity(e:Entity):void {
		this.entities.push(e);
	}

	getState(): any {
		var state = {
			entities: this.entities.map((ent:Entity) => {
				return ent.getState();
			}),
			entitiesToDespawn: this.entitiesToDespawn.map((ent: Entity) => {
				return ent.getGUID()
			})
		};
		return state;
	}

	flushState(): any {
		var state = this.getState();
		this.cleanUpPostTick();
		return state;
	}

	getEntities():Entity[] {
		return this.entities;
	}

	removeEntity(entity:Entity):void {
		var index = this.entities.indexOf(entity);
		if (index != -1) {
			this.entities.splice(index, 1);
			this.entitiesToDespawn.push(entity);
			console.log("TO DESPAWN!", this.entitiesToDespawn.map((ent: Entity) => {
				return ent.toString()
			}));
		}
	}

	getEntity(entityID:number): Entity{
		for (var i = 0; i < this.entities.length; ++i) {
			var e = this.entities[i];
			if (e.getGUID() == entityID) {
				return e;
			}
		}
		return null;
	}

	getRandomPosition(): Vector3 {
		var minX = 0,
			maxX = 50,
			minY = 0,
			maxY = 50,
			minZ = 0,
			maxZ = 0;
		var x = minX + (maxX - minX)*Math.random(),
			y = minY + (maxY - minY)*Math.random(),
			z = 0; //TODO: unhardcode

		return Vector3.create(x,y,z);
	}

	// TODO: use the component event library used by the ts-game-engine-client framework or is this enough?
	sendEventToEntities(eventName: string, args: any[]): void {
		console.log("Propagating event to "+this.entities.length+" entities");
		this.entities.forEach((e: Entity) => {
			e.receiveEvent(eventName, args);
		})
	}
}
