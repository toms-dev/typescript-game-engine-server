
import IComponent from "./IComponent";
import Entity from "../Entity";
import Health from "./common/Health";
export default class Fight implements IComponent {

	private attack: number;

	dealDamages(target: Entity) {
		var health: Health = target.getComponent(Health);
		health.takeDamage(this.attack);
	}

	tick(delta:number):void {
	}

	getState():any {
		return {
			attack: this.attack
		};
	}

}