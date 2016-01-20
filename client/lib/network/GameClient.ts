
import InternalMessageType from "./../network/InternalMessageType";
import Game from "../Game";

declare var window: any;
declare var console: any;

window.serverLagHistory = {};

export default class GameClient {

	private host: string;
	private port: number;
	private connection: WebSocket;

	private game: Game;

	private handlers: {[messageType: string]: (data:any) => void};

	private requestID: number;
	private requestCallbacks: {[requestID: number]: (data:any) => void};
	private processingState: boolean;

	constructor(game: Game, host: string, port: number) {
		this.game = game;
		this.host = host;
		this.port = port;

		this.requestID = 1;
		this.requestCallbacks = [];

		this.handlers = {};
		this.handlers[InternalMessageType.SERVER_STATE] = this.processServerState;
		this.handlers[InternalMessageType.PING_MEASURE] = this.processPingMeasure;
		this.handlers[InternalMessageType.PING_VALUE] = this.processPingValue;
	}

	public connect(callback: () => void) {
		var url = "ws://"+ this.host +":"+ this.port +"/";
		var ws = window.WebSocket || window.MozWebSocket;
		this.connection = new ws(url);
		var self = this;
		console.groupEnd("Connection");

		// Wire all the events
		this.connection.onmessage = function(e){
			self.receiveMessage(e.data);
		};

		this.connection.onopen = function(e){
			console.log("Connected to server @ "+url);
			self.onConnected(callback);
		};

		this.connection.onerror = function(e){
			console.error("Error:",e);
			self.onDisconnected();
		};

		this.connection.onclose = function(e){
			console.log("Connection to server closed:",e);
			self.onDisconnected();
		};
	}

	receiveMessage(data:String|ArrayBuffer|Number[]|any):void {
		//console.debug("Message received:", data);
		var json = JSON.parse(data);

		var type = json.type;
		var payload = json.data;

		if ([InternalMessageType.SERVER_STATE, InternalMessageType.PING_MEASURE, InternalMessageType.PING_VALUE].indexOf(type) == -1) {
			console.debug("Received ", type, InternalMessageType[type]);
		}

		// Check if response to request
		if (json.hasOwnProperty("requestID")) {
			var requestID = json.requestID;
			var callback = this.requestCallbacks[requestID];
			callback(json);
		} else {
			var handler = this.handlers[type];
			if (! handler) {
				console.log("json=", json.type);
				console.log("HANDLERS=", this.handlers);
				// DEBUG START
				this.disconnect();
				// DEBUG END
				throw new Error("No handler for message type "+type);
			}

			try {
				handler.call(this, payload);
			} catch(e) {
				this.disconnect();
				console.log(e);
				throw e;
			}
		}
	}

	disconnect(): void {
		this.connection.close();
	}

	onConnected(callback: () => void):void {
		callback();
		// Send the handshake to get initial data
		//this.doHandshake(callback);
	}

	onDisconnected():void {

	}

	/**
	 * @deprecated Not used anywhere...
	 *
	 * @param playerName
	 * @param callback
	 */
	joinGame(playerName: string, callback: () => void): void {
		var data = {
			playerName: playerName
		};
		this.request(InternalMessageType.JOIN_GAME, data, () => {
			console.log("Join game OK");
			// Send the handshake to get initial data
			this.doHandshake(() => {
				//this.game.onGameJoin();
				console.log("Handshake OK");
				callback()
			});
		});
	}

	sendMessage(messageType: string, data: any, requestID?: number): void {
		var message: any = {
			type: messageType,
			data: data
		};
		if (requestID) {
			message.requestID = requestID;
		}
		this.connection.send(JSON.stringify(message));
	}

	request(messageType: string, data: any, callback: (data:any) => void): void {
		// Add a request ID to the message to be able to identify the response
		var requestID = this.requestID++;
		this.sendMessage(messageType, data, requestID);
		console.log("Request #" + requestID + " created.");
		this.requestCallbacks[requestID] = callback;
	}

	doHandshake(callback: () => void): void {
		this.request(InternalMessageType.HANDSHAKE, {}, callback);
	}

	sendInputState(inputState: any):void {
		this.sendMessage(InternalMessageType.INPUT_STATE, inputState);
	}

	processServerState(data: any): void {
		// Safety check to prevent server being faster than client (lol)
		if (this.processingState) {
			throw new Error("Already Processing!");
		}
		this.processingState = true;
		this.game.processServerState(data);
		this.processingState = false;

		if (data.serverTime) {
			window.serverLagHistory[new Date().getTime()] = data.serverTime;
		}
	}

	processPingMeasure(data: any): void {
		this.sendMessage(InternalMessageType.PING_MEASURE, {});
	}

	processPingValue(data: any): void {
		this.game.processPingValue(data.ping);
	}

	// TODO: processing of custom actions

}