
import IComponent from "./../IComponent";
import Entity from "../../Entity";
import Health from "./Health";
export default class Fight implements IComponent {

	private entity: Entity;
	private attack: number;

	constructor(entity:Entity) {
		this.entity = entity;
	}

	dealDamages(target: Entity) {
		var health: Health = target.getComponent(Health);
		health.takeDamage(this.attack, this.entity);
	}

	tick(delta:number):void {
	}

	getState():any {
		return {
			attack: this.attack
		};
	}

}