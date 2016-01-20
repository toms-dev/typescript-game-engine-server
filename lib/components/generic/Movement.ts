
import IComponent from "./../IComponent";
import Vector3 from "../../math/Vector3";
export default class Movement implements IComponent {

	private position: Vector3;
	private speed: Vector3;
	/**
	 * Meter per second
	 */
	private maxSpeed: number;
	private acceleration: Vector3;

	private target: Vector3;
	private targetDistanceThreshold: number;
	public targetReachedCallback: (now: number) => void;

	constructor() {
		this.position = new Vector3();
		this.speed = new Vector3();
		this.maxSpeed = 1;

		this.target = null;
		this.targetDistanceThreshold = 0.1;
	}

	tick(delta:number, now: number):void {
		var deltaS = delta/1000;

		// Move to target, if any
		if (this.target) {
			var diff = this.position.to(this.target);
			if (diff.norm() >= this.targetDistanceThreshold) {
				this.setDirection(diff);
			}
		}

		// TODO: apply acceleration

		// Update the position to follow the speed
		var deltaPosition = this.speed.multiplyScalar(deltaS);
		var newPosition = this.position.add(deltaPosition);
		this.position.copyFrom(newPosition);

		// Clean-up target when reached
		if (this.hasTarget() && this.isTargetReached()) {
			// TODO: improve target reach detection
			// Note: if the following line is uncommented, there is an unnatural/unpleasant snapping effect when
			// target is reached because of the target copy
			//this.position.copyFrom(this.target);
			this.clearTarget();
			if (this.targetReachedCallback) {
				this.targetReachedCallback(now);
			}
		}
	}

	getState(): any {
		return {
			position: this.position.toJSON(),
			speed: this.speed.toJSON()
		}
	}

	setMaxSpeed(maxSpeed: number): void {
		this.maxSpeed = maxSpeed;
	}

	setSpeed(v: Vector3): void {
		this.speed.copyFrom(v);
	}

	setDirection(directionVector:Vector3):void {
		var newSpeed = directionVector.normalize().multiplyScalar(this.maxSpeed);
		this.setSpeed(newSpeed);
	}

	getPosition():Vector3 {
		return this.position;
	}

	setPosition(position:Vector3):void {
		this.position.copyFrom(position);
	}

	moveTo(target:Vector3):void {
		this.target = target;
	}

	hasTarget(): boolean {
		return this.target != null;
	}

	isTargetReached(): boolean {
		if (! this.hasTarget()) {
			return false;
		}
		var distToTarget = this.position.to(this.target).norm();
		if (distToTarget <= this.targetDistanceThreshold) {
			return true;
		}
	}

	clearTarget(): void {
		this.target = null;
		this.setSpeed(new Vector3());
	}
}
