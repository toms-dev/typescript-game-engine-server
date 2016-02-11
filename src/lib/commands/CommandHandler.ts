
import CommandType from "./CommandType";
import {
	CommandResponseJSON,
	CommandSuccessResponse,
	CommandFailureResponse} from "./Command";


export class Command {

	public name: string;

	constructor(name: string) {
		this.name = name;
	}

	execute(...args: any[]): void {
		throw new Error("Not implemented");
	}

	toString() {
		return "Command[" + this.name + "]";
	}
}

export default class CommandHandler {

	private commands: Command[];

	constructor() {
		this.commands = [];
	}

	private getCommand(name: string): Command {
		var matching = this.commands.filter((c: Command) => {
			return c.name == name;
		});
		return matching.length >= 1 ? matching[0] : null;
	}

	public addCommand(command: Command) {
		if (this.getCommand(command.name)) {
			throw new Error("Command '" + command.name + "' already exists!");
		}
		this.commands.push(command);
	}

	execute(commandID: number, commandName: string, args: any[]): CommandResponseJSON {
		var command = this.getCommand(commandName);
		if (!command) {
			throw new Error("No command named '" + commandName + "'. Available:"
				+ this.commands.map((c: Command) => {
					return c.name;
				}));
		}
		console.log("Executing " + command);

		var response: CommandResponseJSON;
		var result: any;
		try {
			result = command.execute.apply(command, args);
			if (result) console.log("\tSuccess. Result: ", result);
			response = new CommandSuccessResponse(commandID, result);
		} catch(e) {
			console.log("\tFailed");
			response = new CommandFailureResponse(commandID, e.name, e.message, {});
		}

		return response;
	}

}