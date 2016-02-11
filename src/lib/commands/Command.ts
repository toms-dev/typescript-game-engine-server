
//import {default as CommandRequest} from "./../../../public/js/commands/Command";
import {
	CommandRequestJSON,
	CommandResponseJSON,
	CommandFailureResponseJSON
} from "./CommandJSON";

export {CommandRequestJSON, CommandResponseJSON};

// TODO: replace this by a function
export class CommandSuccessResponse implements CommandResponseJSON {
	success: boolean;
	commandID: number;
	data: {};

	constructor(commandID: number, data: {}) {
		this.success = true;
		this.commandID = commandID;
		this.data = data;
	}
}

export class CommandFailureResponse extends CommandSuccessResponse implements CommandFailureResponseJSON {
	reason: string;
	message: string;

	constructor(commandID: number, reason: string, message: string, data: {}) {
		super(commandID, data);
		this.success = false;
		this.reason = reason;
		this.message = message;
	}
}

