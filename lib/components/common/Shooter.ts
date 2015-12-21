import IComponent from "./../IComponent";
import Entity from "../../Entity";
import Health from "./Health";
import Projectile from "../../entities/Projectile";
import Movement from "./../generic/Movement";
import World from "../../World";
import Collision from "./../generic/Collision";
import Vector3 from "../../math/Vector3";

export default class Shooter {

	private world:World;
	private entity:Entity;

	private currentCooldown: number;
	private shootCooldown: number = 0;

	constructor(world:World, entity:Entity) {
		this.entity = entity;
		this.world = world;

		this.currentCooldown = this.shootCooldown;
	}

	shoot(target:Entity) {
		var health:Health = target.getComponent(Health);
		if (!health) {
			console.log("Target " + target + " has no health, skipping.");
			return;
		}

		var targetMovement:Movement = target.getComponent(Movement);

		var targetPosition = targetMovement.getPosition();

		this.shootToPosition(targetPosition);
	}

	private onHit(target:Entity):void {
		// TODO: add some stats or something like that
	}

	tick(delta:number):void {
		this.currentCooldown -= delta;
	}

	getState():any {
		return undefined;
	}

	shootToPosition(targetPosition:Vector3):Projectile {
		// Skip if cooldown is still active
		if (this.currentCooldown > 0) return;

		var selfMovement:Movement = this.entity.getComponent(Movement);

		// Bullet settings
		var range = 28;
		var position = selfMovement.getPosition();
		var speed = 17;
		var size = 2.5;
		var damages = 10;

		// Spawn the bullet
		console.log("Creating bullet @ ", position);
		console.log("Target position @ ", targetPosition);
		var bullet = new Projectile(this.world, position, targetPosition, range, speed, size, damages, this.entity);
		bullet.hitCallback = (e:Entity) => {
			console.log("Bullet hit "+e+" !");
			this.onHit(e);
		};
		bullet.missCallback = () => {
			console.log("Bullet missed!");
		};
		this.world.addEntity(bullet);

		// Shot is considered performed, set the cooldown time
		this.currentCooldown = this.shootCooldown;

		// Fire!
		bullet.fire();
		return bullet;
	}
}
