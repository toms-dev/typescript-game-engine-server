
import {Game, IComponent, Entity, MovementComponent} from "../../../../../client/index";
import CommandSender from "../../../../../client/lib/components/common/CommandSender";

// TODO: ColorButton should maybe implement UIComponent to declare the setup() method.
export default class ColorButton implements IComponent {

	private commandSender: CommandSender;

	constructor(commandSender: CommandSender) {
		this.commandSender = commandSender;

		this.setup();
	}

	setup(): void {
		this.commandSender.add();
		$("#colorButton").click(() => {

		})
	}

	loadState(state: any): void {
		// do nothing
	}

	tick(delta: number, now: number): void {
		// do nothing
	}

}