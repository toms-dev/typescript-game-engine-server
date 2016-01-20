
import {Game, IComponent, Entity, MovementComponent} from "../../../../../client/index";

export default class My2DRenderer implements IComponent {

	private game: Game;

	constructor(game:Game) {
		this.game = game;
	}

	loadState(entityData: any): void {

	}

	tick(delta: number, now: number): void {
		var canvas: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById('gameView');
		var ctx = canvas.getContext('2d');
		ctx.clearRect(0,0, canvas.width, canvas.height);

		var scale = 30;

		this.game.world.getEntities().forEach((ent: Entity) => {
			console.warn("Warning: Renderer is using debugRawData in entity!");
			// TODO: should not use debugRawData but movement component instead. There is a problem
			// in the state loading system.
			/*var movement = ent.getComponent(MovementComponent);
			var pos = movement.getPosition().toJSON();*/
			var raw = (<any> ent).debugRawData;
			var pos = raw.position;

			var color = raw.colorName;
			ctx.fillStyle = color ? color: "red";
			ctx.fillRect(pos.x * scale, pos.y * scale, 50, 50);
		});
	}

}
