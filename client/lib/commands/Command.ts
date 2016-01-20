import CommandType from "./CommandType";

export interface CommandSuccessCallback {
	(data: any) : void;
}
export interface CommandFailureCallback {
	(response: CommandFailureResponse) : void;
}

/**
 * Command request format that are sent to server.
 */
export interface CommandRequest {
	commandID: number;
	name: string;
	params: any[];
}

/**
 * Command response received from the server.
 */
export interface CommandResponse {
	success: boolean;
	commandID: number;
	data: {};
}

/**
 * Command response format received from the server in case of failure.
 */
export interface CommandFailureResponse extends CommandResponse{
	reason: string;
	message: string;
}

/**
 * Client-side definition of a command, with callbacks of success/failure.
 */
export default class Command {
	public name: string;
	public params: any[];
	public commandID: number;
	private static commandID_AutoIncrement = 1;

	private successCallback: CommandSuccessCallback;
	private failureCallback: CommandFailureCallback;

	constructor(type:string, args:any[] = [],
	//constructor(type:CommandType, args:any[] = [],
				successCallback: CommandSuccessCallback = null,
				failureCallback: CommandFailureCallback = null
	) {
		this.commandID = Command.commandID_AutoIncrement++;
		this.name = CommandType[type];
		this.params = args;

		this.successCallback = successCallback;

		if (failureCallback == null) {
			console.warn("Using default failure callback for command "+this.name+".");
			failureCallback = (response: CommandFailureResponse) => {
				alert("Command "+this.name+"#"+response.commandID+" failed: " + response.reason+": "+response.message);
			}
		}
		this.failureCallback = failureCallback;
	}

	public processResponse(response: CommandResponse): void {
		if (response.success) {
			this.onSuccess(response);
		}
		else {
			this.onFailure(<CommandFailureResponse> response);
		}
	}

	private onSuccess(response: CommandResponse): void {
		if (this.successCallback) this.successCallback(response.data);
	}

	private onFailure(response: CommandFailureResponse) {
		if (this.failureCallback) this.failureCallback(response);
	}

	public getState(): CommandRequest {
		return {
			name: this.name,
			params: this.params,
			commandID: this.commandID
		}
	}
}

