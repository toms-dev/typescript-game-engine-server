import CommandType from "./CommandType";

/**
 * Command request format that are sent to server.
 */
export interface CommandRequestJSON {
	commandID: number;
	name: string;
	params: any[];
}

/**
 * Command response received from the server.
 */
export interface CommandResponseJSON {
	success: boolean;
	commandID: number;
	data: {};
}

/**
 * Command response format received from the server in case of failure.
 */
export interface CommandFailureResponseJSON extends CommandResponseJSON {
	reason: string;
	message: string;
}
