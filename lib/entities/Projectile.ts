import Entity, {EntityType} from "../Entity";
import Vector3 from "../math/Vector3";
import Collision from "../components/Collision";
import Movement from "../components/Movement";
import World from "../World";
import Health from "../components/common/Health";
export default class Projectile extends Entity {

	private speed:number;
	private size:number;
	private damages:number;
	private collision:Collision;
	private movement:Movement;
	private range:number;
	private source:Entity;

	private hasHit:boolean;

	public hitCallback:(target:Entity) => void;
	public missCallback:() => void;

	constructor(world:World, position:Vector3, targetDirection:Vector3, range:number, speed:number, size:number,
				damages:number, source:Entity) {
		super(world, EntityType.BULLET);
		this.range = range;
		this.speed = speed;
		this.size = size;
		this.damages = damages;

		this.movement = new Movement();
		this.components.push(this.movement);
		this.movement.setPosition(position);

		this.collision = new Collision(this, world, this.size);
		this.collision.addIgnoredEntity(source);
		this.collision.collisionCallbacks.add(this, (target:Entity) => {
			console.log("Projectile collided with ", target.getTypeName()+"#"+target.getGUID());
			this.onHit(target);
		});
		this.components.push(this.collision);

		this.hasHit = false;

		// Compute the direction according to the target position
		// then normalize and scale to match the range
		var direction = targetDirection.diff(position);
		var rangedDirection = direction.normalize().multiplyScalar(range);
		this.movement.moveTo(position.add(rangedDirection));
		this.movement.setMaxSpeed(0);
		this.movement.targetReachedCallback = () => {
			if (!this.hasHit) this.onMiss();
		};

		this.source = source;
	}

	fire():void {
		this.movement.setMaxSpeed(this.speed);
	}

	getState() {
		var base = super.getState();
		base.size = this.size;
		return base;
	}

	onHit(target:Entity):void {
		// Skip if projectile has already hit the target
		// It may happen if an entity is emitted from the target entity (like boards).
		if (this.hasHit) return;

		var targetHealth:Health = target.getComponentOrNull(Health);

		if (! targetHealth) {
			console.log("No health on projectile target. Ignoring entity.");
			return;
		}

		this.hasHit = true;

		targetHealth.takeDamage(this.damages, this);

		if (this.hitCallback) {
			this.hitCallback(target);
		}

		this.despawn();
	}

	onMiss():void {
		this.despawn();
		if (this.missCallback) {
			this.missCallback();
		}
	}
}
