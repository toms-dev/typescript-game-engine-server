
import IComponent from "./IComponent";
import Collision from "./Collision";
import Entity from "../Entity";
export default class Lootable implements IComponent {

	private quantity: number;

	private worldEntity: Entity;
	active: boolean;

	constructor(worldEntity: Entity, quantity: number) {
		this.worldEntity = worldEntity;
		this.active = true;
		this.quantity = quantity;
	}

	tick(delta:number):void {
	}

	getState():any {
		return undefined;
	}

	loot():void {
		if (! this.active) throw new Error("Looting inactive object!");
		this.active = false;
		this.worldEntity.despawn();
	}

	getQuantity():number {
		return this.quantity;
	}
}
