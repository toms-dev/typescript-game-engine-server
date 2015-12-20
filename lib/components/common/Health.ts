
import IComponent from "./../IComponent";
import Entity from "../../Entity";
import CallbackManager from "../../utils/CallbackManager";

export default class Health implements IComponent {

	private value: number;
	private maxValue: number;
	public damageCallbacks: CallbackManager<(amount: number, source: Entity) => void>;
	public deathCallbacks: CallbackManager<() => void>;

	constructor(value: number, maxValue: number) {
		this.value = value;
		this.maxValue = maxValue;

		this.value = Math.min(value, maxValue);

		this.damageCallbacks = new CallbackManager<any>();
		this.deathCallbacks = new CallbackManager<any>();
	}

	tick(delta:number):void {
		if (this.value == 0) {
			this.deathCallbacks.call();
		}
	}

	getState():any {
		return {
			health: this.value,
			maxHealth: this.maxValue
		};
	}

	takeDamage(amount: number, source: Entity): void {
		var previousValue = this.value;
		this.value -= amount;
		// Cap
		if (this.value < 0) this.value = 0;

		var diff = previousValue - this.value;
		if (diff > 0) {
			this.damageCallbacks.call(amount, source);
		}
	}

	heal(amount: number): void {
		this.value += amount;
		// Cap
		if (this.value > this.maxValue) this.value = this.maxValue;
	}

	isDead(): boolean {
		return this.value == 0;
	}

	isMaxHealth(): boolean {
		return this.value == this.maxValue;
	}

	changeMaxValue(delta:number):void {
		this.maxValue += delta;
	}

	getDamages():number {
		return this.maxValue - this.value;
	}

	getValue():number {
		return this.value;
	}

	getMaxValue(): number {
		return this.maxValue;
	}
}