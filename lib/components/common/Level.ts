
import IComponent from "./../IComponent";
import CallbackManager from "../../utils/CallbackManager";

export default class Level implements IComponent {

	private value: number;

	public levelUpCallbacks: CallbackManager<(newLevel: number) => void>;

	constructor(initialValue: number) {
		this.value = initialValue;
		this.levelUpCallbacks = new CallbackManager<any>();
	}

	tick(delta:number, now:number):void {
	}

	getValue(): number {
		return this.value;
	}

	levelUp(): void {
		this.value++;
		this.levelUpCallbacks.call(this.value);
	}

	getState():any {
		return {
			level: this.value
		};
	}

}
