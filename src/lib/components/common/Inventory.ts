
import IComponent from "./../IComponent";
import Lootable from "./Lootable";
export default class Inventory implements IComponent {

	public quantity: number;

	constructor() {
		this.quantity = 0;
		/*setInterval(() => {
			this.quantity += 1;
		}, 500);*/
	}

	tick(delta:number):void {
	}

	getState():any {
		return {
			inventory: {
				quantity: this.quantity
			}
		};
	}

	loot(lootable:Lootable):void {
		this.quantity += lootable.getQuantity();
	}

	pay(quantity: number) : void {
		if (! this.canPay(quantity)) {
			throw new Error("Can't pay "+quantity+", only has "+this.quantity);
		}
		this.quantity -= quantity;
	}

	canPay(amount:number): boolean {
		return this.quantity >= amount;
	}
}
