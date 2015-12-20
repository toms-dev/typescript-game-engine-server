
import IComponent from "./IComponent";
import Entity from "../Entity";
import Lootable from "./Lootable";
import Collision from "./Collision";
import Inventory from "./Inventory";

/**
 * An autolooter will pickup everything he walks upon.
 */
export default class AutoLooter implements IComponent {

	constructor(inventory: Inventory, collision: Collision) {
		collision.collisionCallbacks.add(this, (other: Entity) => {
			var lootable: Lootable = other.getComponentOrNull(Lootable);
			if (! lootable) {
				//console.log("Not lootable: "+other);
				return;
			}
			if (! lootable.active) {
				return;
			}
			console.log("Looting OK!");
			lootable.loot();
			inventory.loot(lootable);
		})
	}

	tick(delta:number):void {
	}

	getState():any {
		return undefined;
	}

}