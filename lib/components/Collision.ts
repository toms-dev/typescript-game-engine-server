import IComponent from "./IComponent";
import World from "../World";
import Movement from "./Movement";
import Entity from "../Entity";
import CallbackManager from "../utils/CallbackManager"

export default class Collision implements IComponent {

	private entity: Entity;
	private movement: Movement;
	private world:World;

	private radius: number;

	//public collisionCallback: (collidedEntity: Entity) => void;
	collisionCallbacks: CallbackManager<(collidedEntity: Entity) => void>;

	private ignoredEntities: Entity[];

	constructor(entity: Entity, world:World, radius:number=1) {
		this.entity = entity;
		this.movement  = this.entity.getComponent(Movement);
		this.world = world;
		this.radius = radius;

		this.ignoredEntities = [];
		this.collisionCallbacks = new CallbackManager<any>();
	}

	addIgnoredEntity(entity: Entity): void {
		this.ignoredEntities.push(entity);
	}

	tick(delta:number):void {
		// Check collision against other entities
		var entities = this.world.getEntities();
		for (var i = 0; i < entities.length; ++i) {
			var entity = entities[i];
			// Skip self
			if (entity == this.entity) continue;
			// TODO: improve this. IgnoredClasses ?
			if (entity instanceof this.entity.constructor) continue;
			// Skip specific entities
			if (this.ignoredEntities.indexOf(entity) != -1) continue;

			var movement: Movement = entity.getComponent(Movement);
			var selfPosition = this.movement.getPosition();
			var otherPosition = movement.getPosition();

			/*console.log("Processing "+entity.getTypeName()+"#"+entity.getGUID());
			console.log("Positions:", selfPosition, otherPosition);
			console.log("To:", selfPosition.to(otherPosition));*/
			var distance = selfPosition.to(otherPosition).norm();
			if (distance <= this.radius) {
				//console.log("Collided because ", distance, "<=", this.radius);
				this.collide(entity);
			}
		}
	}

	getState():any {
		return {
			radius: 2
		};
	}

	collide(collidedEntity: Entity): void {
		this.collisionCallbacks.call(collidedEntity);
	}

}
