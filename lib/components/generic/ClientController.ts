import Entity from "../../Entity";
import Client from "../../Client";
import IComponent from "./../IComponent";

import InputAction from "../../client/InputAction";
import Movement from "./Movement";
import Vector3 from "../../math/Vector3";
import IUserAction from "./../IUserAction";
import World from "../../World";

import CommandType from "../../commands/CommandType";
import {CommandRequestJSON, CommandResponseJSON} from "../../commands/Command";

export default class ClientController implements IComponent {

	private client: Client;
	private entity: Entity;
	private world: World;

	/**
	 * This is the exact current state of the keyboard
	 */
	private downKeys: InputAction[];
	/**
	 * This state is flushed every tick. It's filled with values from downKeys
	 */
	private bufferedDownKeys: InputAction[];
	private actionType: string;
	/**
	 * This is the position in the world at which the user performed an action.
	 */
	private actionPosition: Vector3;
	private actionEntityID: number;
	private UserActionClass: new (entity: Entity) => IUserAction;

	// commandName => ...args
	//private commandsBuffer: {[commandName: string]: any[]};
	private commandsBuffer: CommandRequestJSON[]; //{[commandName: string]: any[]};
	/** The buffer contains all the responses from the commands to be sent on next state flush */
	private commandResponsesBuffer: CommandResponseJSON[];

	constructor(client: Client, world: World) {
	//constructor(client: Client, entity: Entity, userActionClass: new (entity: Entity) => IUserAction, world: World) {
		this.client = client;
		/*this.entity = entity;
		this.UserActionClass = userActionClass;*/
		this.world = world;

		this.downKeys = [];
		this.bufferedDownKeys = [];
		this.actionType = null;
		this.actionPosition = null;
		this.actionEntityID = null;

		this.commandsBuffer = [];
		this.commandResponsesBuffer = [];
	}

	public loadState(inputState: any): void {
		/*console.log("DEBUG: Got input state: ", inputState);
		console.log("DEBUG: Skipping keyboard and mouse for debugging purposes!");*/

		/*
		// Keyboard
		var rawKeys = inputState.keys.downKeys;
		var cleanKeys: any = [];
		for (var i = 0; i < rawKeys.length; ++i) {
			var k = rawKeys[i];
			var cleanKey = InputAction[k];
			cleanKeys.push(cleanKey);
		}
		if (rawKeys.length != this.downKeys.length) {
			//console.log("New input state:", cleanKeys);
		}

		this.downKeys = cleanKeys;

		// Propagate to the bufferedDownKeys array
		for (var i = 0; i < this.downKeys.length; ++i) {
			var downKey = this.downKeys[i];
			if (this.bufferedDownKeys.indexOf(downKey) == -1) {
				this.bufferedDownKeys.push(downKey);
			}
		}

		// Primary/Secondary actions
		// (mouse)
		if (inputState.action) {
			// If no action is in the buffer and an action was performed by the client, do the processing
			if (!this.actionType && inputState.action.type) {
				this.actionType = inputState.action.type;
				console.log("Action found!", inputState.action);

				// Can be on an entity
				if (inputState.action.targetEntityID) {
					this.actionEntityID = inputState.action.targetEntityID;
				}
				// Can be at a world position
				else if (inputState.action.targetPosition) {
					this.actionPosition = Vector3.fromJSON(inputState.action.targetPosition);
				}
				else {
					console.error("Action cancelled...");
					this.actionType = null;
				}
			}
		}
		*/

		// Commands from UI
		if (inputState.commands) {
			var commands: CommandRequestJSON[] = inputState.commands;
			if (commands.length > 0) {
				console.log("DEBUG: commands: ", commands);
				console.log("Got commands from client: ["+commands.map((c: CommandRequestJSON) => {
						return c.name
					}).join(',')+"]"
				);
			}
			commands.forEach((command: CommandRequestJSON) => {
				// TODO: should there be a mapping from command names to internal events? => That would be safer,
				// ensuring only valid/legit events are generated.
				this.client.rootController.receiveCommand(command);
				//this.world.sendEventToEntities(command.name, command.data);
				// TODO: process callback
			});
			// Only process when there are some command to process! #captain
			/*if (commands.length != 0) {
				console.log("Received Commands:", commands);

				// Filter only valid commands from a white-list
				var validCommandNames: string[] = [
					CommandType.REPAIR_SHIP, CommandType.UPGRADE_SHIP, CommandType.UPGRADE_CANNON
				].map((c: CommandType) => {
						return CommandType[c]
					});

				// Add valid commands to the buffer, so they get processed on next tick
				for (var i = 0; i < commands.length; ++i) {
					var command: CommandRequest = commands[i];

					var commandName: string = command.name,
						commandParams: any[] = command.params,
						commandRequestID: number = command.commandID;

					// skip commands that are not in the white list
					if (validCommandNames.indexOf(commandName) == -1) continue;
					console.log("COMMAND:", command);
					this.commandsBuffer.push(command);
					//this.commandsBuffer[commandName] = commandParams;
				}
			}*/
		}
	}

	tick(delta: number): void {
		this.processMovementInput();
		this.processActionInput();
		this.processCommands();
	}

	private processMovementInput(): void {
		var downKeys = this.bufferedDownKeys;
		this.bufferedDownKeys = [];

		// TODO: Generic: map the inputs to a move vector
		var vectorKeys: any = {};
		/*vectorKeys[InputAction.UP] = [0, 1];
		vectorKeys[InputAction.DOWN] = [0, -1];
		vectorKeys[InputAction.LEFT] = [-1, 0];
		vectorKeys[InputAction.RIGHT] = [1, 0];*/
		//console.log("Vector keys:", vectorKeys);

		// Browse all the down keys to update the move vector
		var directionComponents = [0, 0];
		for (var i = 0; i < downKeys.length; ++i) {
			var key = downKeys[i];
			// TODO: Generic: this is probably broken
			/*var keyName = InputAction[key];
			if (!vectorKeys.hasOwnProperty(keyName)) {
				console.log("Key not found:", key, InputAction[key]);
				continue;
			}
			var keyVector = vectorKeys[keyName];
			directionComponents[0] += keyVector[0];
			directionComponents[1] += keyVector[1];*/
		}

		var movement: Movement = this.entity.getComponent(Movement);

		var directionVector = Vector3.fromArray(directionComponents);
		if (directionVector.norm() == 0) {
			movement.setSpeed(new Vector3());
			return;
		}
		movement.setDirection(directionVector);
	}

	private processActionInput(): void {
		var userAction: IUserAction = this.entity.getComponent(this.UserActionClass);

		if (this.actionType == "primary") {
			if (this.actionEntityID) {
				var entityID = this.actionEntityID;
				this.actionEntityID = null;	// reset the entityID to prevent double action on next tick
				var entity = this.world.getEntity(entityID);
				if (!entity) {
					console.error("WARNING: Entity not found (id: " + entityID + ")");
					return;
				}
				userAction.onPrimaryEntity(entity);
			}
			else if (this.actionPosition) {
				userAction.onPrimaryPosition(this.actionPosition);
				this.actionPosition = null;
			}
		}

		this.actionType = null;
		this.actionEntityID = null;
		this.actionPosition = null;
	}

	private processCommands(): void {
		var userAction: IUserAction = this.entity.getComponent(this.UserActionClass);

		// Process commands

		for (var i = 0; i < this.commandsBuffer.length; i++) {
			var command = this.commandsBuffer[i];
			console.warn("WARNING: disabled command processing with callback.");
			/*var commandResponse = userAction.doCommand(command.commandID, command.name, command.params);
			this.commandResponsesBuffer.push(commandResponse);*/
		}
		/*
		var commandName: string;
		for (commandName in this.commandsBuffer) {
			if (!this.commandsBuffer.hasOwnProperty(commandName)) continue;
			var commandParams = this.commandsBuffer[commandName];
			console.log("Processing command " + commandName);

			var commandResponse = userAction.doCommand(commandName, commandParams);
			this.commandResponsesBuffer.push(commandResponse);
		}*/

		// Reset UI commands
		this.commandsBuffer = [];
	}

	flushCommandResponses(): CommandResponseJSON[] {
		var responses = this.commandResponsesBuffer;
		this.commandResponsesBuffer = [];
		if (responses.length > 0) {
			console.log("Sending responses!!!!! ", responses);
		}
		return responses;
	}

	getState(): any {
		return undefined;
	}

}
