
import websocket = require('websocket');

import GameServer from "./GameServer";
import InternalMessageType from "./network/InternalMessageType";
import InternalMessageTypeValue from "./network/InternalMessageTypeValue";
import MessageType from "./network/MessageType";
import Entity from "./Entity";
import ClientController from "./components/generic/ClientController";
import Controller from "./controllers/Controller";

export interface ServerState {
	serverTime: number,
	world: {
		entities: any[],
		entitiesToDespawn: any[]
	}
}

/**
 * Handles all the networking aspect of the client communication.
 */
export default class Client {

	private static idAutoIncrement = 1;

	private id: number;

	private connection: websocket.connection;
	private gameServer: GameServer;

	private handlers: {[messageType: string]: (data: any, requestID?: number) => void};

	private commandController: ClientController;

	// TODO: should this be private? (currently used by ClientController but when ClientController will extend
	// controller, it won't have to be public anymore)
	public rootController: Controller;

	private controlledEntity: Entity;
	private pingSentTime: Date;
	private ping: number;
	public playerName: string;

	private maximumFakeLag: number;
	// This is is the time at which the current instruction will be sent, according to fake lag.
	private currentLagTime: number;
	private messageID: number = 1;

	constructor(gameServer: GameServer, connection: any) {
		this.id = Client.idAutoIncrement++;

		this.gameServer = gameServer;
		this.connection = connection;

		this.handlers = {};
		this.handlers[InternalMessageTypeValue.HANDSHAKE] = this.processHandshake;
		this.handlers[InternalMessageTypeValue.JOIN_GAME] = this.processJoinGame;
		this.handlers[InternalMessageTypeValue.INPUT_STATE] = this.processInputState;
		this.handlers[InternalMessageTypeValue.PING_MEASURE] = this.processPingMeasure;

		// Networking
		this.ping = 0;
		this.pingSentTime = null;

		this.maximumFakeLag = 0; // 150
		this.currentLagTime = new Date().getTime();

		// Client Controller: set by GameServer
		this.rootController = null;
		// TODO: the root controller should be the ClientController class, and the clientConnect should be a child
		// of this class.

		this.setupConnection();
	}

	setupConnection() {
		this.connection.on('message', (message: websocket.IMessage) => {
			if (message.type === 'utf8') {
				this.onMessage(message.utf8Data);
			}
			else if (message.type === 'binary') {
				console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
				this.connection.sendBytes(message.binaryData);
			}
		});
		this.connection.on('close', (reasonCode, description) => {
			console.log((new Date()) + ' Peer ' + this.connection.remoteAddress + ' disconnected.');
			this.onDisconnect();
			this.gameServer.onClientDisconnect(this);
		});
	}

	private onMessage(data: any):void {
		var json = JSON.parse(data);

		var payload = json.data;

		var requestID: number = null;
		if (json.hasOwnProperty("requestID")) {
			requestID = json.requestID;
		}

		var handler = this.handlers[json.type];
		if (! handler) {
			throw new Error("No handler defined for action " + json.type);
		}

		handler.call(this, payload, requestID);
	}

	private respond(type: MessageType, data: any, requestID: number) {
		this.sendMessage(type, data, requestID);
	}

	private sendMessage(type: MessageType, data: any, requestID?:number): void {
		var message: any = {
			type: type.value,
			data: data
		};
		if (requestID) {
			message.requestID = requestID;
		}

		if (this.maximumFakeLag <= 0) {
			this.connection.send(JSON.stringify(message));
		} else {
			var now = new Date().getTime();
			var currentLag = this.currentLagTime - now;
			var newLag = Math.ceil(Math.random() * this.maximumFakeLag);
			var safetyMargin = 20;
			newLag = Math.max(currentLag + safetyMargin, newLag);

			this.currentLagTime = now + newLag;
			//console.log("Message #"+(this.messageID++)+" @ "+this.currentLagTime+ " (lag: "+newLag+", previous: "+currentLag+" )");
			setTimeout(() => {
				this.connection.send(JSON.stringify(message));
			}, newLag);
		}
	}

	public updateRemoteState(): void {
		var state: any = {
			serverTime: 1337,
			world: this.rootController.getWorldState()
		};

		this.sendServerState(state);
	}

	public sendServerState(serverState: ServerState):void {
		// Note: it is necessary to "copy" serverState structure to preserve the original object.
		var state = {
			serverTime: serverState.serverTime,
			world: serverState.world,
			commandResponses: this.commandController.flushCommandResponses()
		};
		this.sendMessage(new InternalMessageType(InternalMessageTypeValue.SERVER_STATE), state);
	}

	setControlledEntity(entity:Entity):void {
		this.controlledEntity = entity;
		this.sendMessage(new InternalMessageType(InternalMessageTypeValue.CONTROLLED_ENTITY), {entityID: entity.getGUID()});
	}

	setController(controller:ClientController):void {
		this.commandController = controller;
	}

	/**
	 * Performs a PING measure
	 */
	updatePing():void {
		// if really high latency, no response yet
		if (this.pingSentTime) {
			return;
		}
		this.pingSentTime = new Date();
		this.sendMessage(new InternalMessageType(InternalMessageTypeValue.PING_MEASURE), {});
	}

	getControlledEntity():Entity {
		return this.controlledEntity;
	}

	private processHandshake(data: any, requestID: number): void {
		console.log("Processing handshake for client#"+this.id);

		var response = {
			tickRate: this.gameServer.tickRate,
			playerID: Math.floor(Math.random()*20)
		};


		this.respond(new InternalMessageType(InternalMessageTypeValue.HANDSHAKE), response, requestID);
		this.sendMessage(new InternalMessageType(InternalMessageTypeValue.CONTROLLED_ENTITY), {entityID: this.controlledEntity.getGUID()});
	}

	private onDisconnect(): void {
		// TODO: not nice to use Date.now() here.
		this.rootController.doDeactivate(Date.now());
	}

	private processJoinGame(data: any, requestID: number): void {
		if (! data.playerName) {
			console.error("Got:", data);
			throw new Error("Empty player name!");
		}
		this.playerName = data.playerName;
		this.gameServer.joinGame(this, data);
		// ACK the client request
		this.respond(new InternalMessageType(InternalMessageTypeValue.JOIN_GAME), true, requestID);
	}

	private processInputState(data: any): void {
		if (this.commandController) {
			this.commandController.loadState(data);
		}
	}

	private processPingMeasure(): void {
		var now = new Date();
		var diff = now.getTime() - this.pingSentTime.getTime();
		this.ping = Math.round(diff/2);
		this.pingSentTime = null;

		this.sendMessage(new InternalMessageType(InternalMessageTypeValue.PING_VALUE), {ping: this.ping});
	}
}
