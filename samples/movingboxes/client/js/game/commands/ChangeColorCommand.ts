
import Command from "../../../../../../client/lib/commands/Command";

export default class ChangeColorCommand extends Command {

	constructor(colorName: string) {
		super("ChangeColor", [colorName]);
	}

}
