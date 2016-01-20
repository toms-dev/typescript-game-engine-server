
export default class LERP {

	private initialValue: number;
	private targetValue: number;
	private duration: number;

	private delta: number;
	private speed: number;
	private currentValue: number;

	private finished: boolean;

	constructor(initialValue: number, targetValue: number, duration: number) {
		this.initialValue = initialValue;
		this.targetValue = targetValue;
		this.duration = duration;

		this.delta = targetValue - initialValue;
		this.speed = this.delta/this.duration;
		this.currentValue = this.initialValue;

		this.finished = false;
	}

	tick(delta: number, now: number) {
		if (this.finished) return;
		this.currentValue += this.speed * delta;
		var currentDelta = this.targetValue - this.currentValue;

		if (Math.abs(currentDelta) >= Math.abs(this.delta)) {
			this.currentValue = this.targetValue;
			this.finished = true;
		}
	}

	getValue(): number {
		return this.currentValue;
	}

	public isFinished(): boolean {
		return this.finished;
	}

}
