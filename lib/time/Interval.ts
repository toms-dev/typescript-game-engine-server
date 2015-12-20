import Timer from "./Timer";

export default class Interval {

	private timer: Timer;

	constructor(period: number, callback: (delta: number, now: number) => void) {
		this.timer = new Timer(period, (delta: number, now: number) => {
			callback(delta, now);
			// TODO: add delta?
			this.timer.reset(now);
		});
	}

	start(now: number): void {
		this.timer.start(now);
	}

	tick(delta: number, now: number): void {
		this.timer.tick(delta, now);
	}


}
