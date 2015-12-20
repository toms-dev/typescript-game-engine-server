
export default class Timer {

	private duration: number;
	private targetTime: number;
	private callback: (delta: number, now: number) => void;
	private done: boolean;


	constructor(duration: number, callback: (delta: number, now: number)=>void) {
		this.duration = duration;
		this.callback = callback;
	}

	start(now: number, duration?:number): void {
		if (duration) this.duration = duration;
		this.reset(now);
	}

	tick(delta: number, now: number): void {
		if (this.done) return;
		if (now >= this.targetTime) {
			this.done = true;
			this.callback(delta, now);
		}
	}

	reset(now: number): void {
		this.done = false;
		this.targetTime = now + this.duration;
	}

	isFinished(): boolean {
		return this.done;
	}

}
