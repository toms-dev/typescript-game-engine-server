
import {Game, IComponent, Entity, MovementComponent} from "../../../../../client/index";

export default class MyRenderer implements IComponent {

	private game: Game;

	constructor(game:Game) {
		this.game = game;
	}

	loadState(entityData: any): void {

	}

	tick(delta: number, now: number): void {
		$("#log").empty();
		this.game.world.getEntities().forEach((ent: Entity) => {
			console.log("Entity in renderer:", ent);

			// TODO: should not use debugRawData but movement component instead. There is a problem
			// in the state loading system.
			/*var movement = ent.getComponent(MovementComponent);
			var pos = movement.getPosition().toJSON();*/
			var pos = (<any> ent).debugRawData.position;
			$("<div>").text("Position:"+JSON.stringify(pos)).appendTo("#log");
		});
	}

}
