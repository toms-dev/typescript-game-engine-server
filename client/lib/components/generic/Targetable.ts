
import Entity from "../Entity";
import IComponent from "./IComponent";
export default class Targetable implements IComponent {

	private targeted: boolean;
	private entity: Entity;

	constructor(entity: Entity) {
		this.entity = entity;
		this.targeted = false;
	}

	loadState(entityData:any):void {
	}

	tick(delta:number):void {
	}
}