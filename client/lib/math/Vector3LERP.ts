
import LERP from "./LERP";
import Vector3 from "./Vector3";
export default class Vector3LERP {

	private xLERP: LERP;
	private yLERP: LERP;
	private zLERP: LERP;
	private currentVector: Vector3;

	private duration: number;
	private startTime: number = null;

	constructor(initialVector: Vector3, targetVector: Vector3, duration: number) {
		// console.error("LERP: from "+initialVector.toJSON().x+" to "+targetVector.toJSON().x);
		this.xLERP = new LERP(initialVector.x, targetVector.x, duration);
		this.yLERP = new LERP(initialVector.y, targetVector.y, duration);
		this.zLERP = new LERP(initialVector.z, targetVector.z, duration);

		this.currentVector = new Vector3(initialVector);

		this.duration = duration;
		this.startTime = null;
	}

	tick(delta: number, now: number): void {
		if (this.startTime == null) {
			this.startTime = now;
		}
		if (now > this.startTime + this.duration) return;
		if (this.isFinished()) return;

		this.xLERP.tick(delta, now);
		this.yLERP.tick(delta, now);
		this.zLERP.tick(delta, now);

		this.currentVector.x = this.xLERP.getValue();
		this.currentVector.y = this.yLERP.getValue();
		this.currentVector.z = this.zLERP.getValue();
		//console.error("LERP VAL = "+this.currentVector.x);
	}

	getValue(): Vector3 {
		return this.currentVector;
	}

	isFinished():boolean {
		return this.xLERP.isFinished() && this.yLERP.isFinished() && this.zLERP.isFinished();
	}
}
