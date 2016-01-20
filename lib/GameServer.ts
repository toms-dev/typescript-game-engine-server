import World from "./World";
import Client from "./Client";
import ClientController from "./components/generic/ClientController";
import AutoLooter from "./components/common/AutoLooter";
import Inventory from "./components/common/Inventory";
import Collision from "./components/generic/Collision";
import Vector3 from "./math/Vector3";
import Timer from "./time/Timer";
import Entity from "./Entity";
import Level from "./components/common/Level";
import DecorationContext from "./decorators/DecorationContext";

import {Generic as GenericComponents} from "./components/_Components";
import WebSocketServer from "./network/WebSocketServer";

export default class GameServer {

	private context: DecorationContext;
	/**
	 * List of clients that will receive game states.
	 */
	private clients: Client[];

	private world: World;

	public publicTimers: Timer[];

	/**
	 * Number of updates per second.
	 * @type {number}
	 */
	//public tickRate: number = 1;
	public tickRate: number = 25;
	private pingFrequency: number = 500;
	private lastUpdate: number;

	private firstTick: boolean;

	constructor() {
		this.clients = [];

		this.world = new World();
		// TODO: Generic: setup local vars (the boardsspawner was setup here)
		this.publicTimers = [];
	}

	// TODO: There should be the possibility to load different maps or have
	// different maps instantiated.
	loadProject(path:string):void {
		DecorationContext.start();
		require(__dirname+"/../"+path);
		this.context = DecorationContext.build();
		console.log("Context loaded.");

		this.loadStartMap();
	}

	private loadStartMap(): void {
		this.world.loadMap(this.context.startMapClass);
	}

	// TODO: replace with an abstract class that generates Clients ?
	public startWebSocketServer() {
		var wsServer = new WebSocketServer();
		wsServer.start((connection) => {
			var client = new Client(this, connection);
			client.setController(new ClientController(client, this.world));
			this.clients.push(client);
		});
	}

	/*addClient(client:Client):void {
		this.clients.push(client);
		console.log("Online clients:", this.clients.length);
		this.joinGame(client);
	}*/

	joinGame(client: Client, playerData: any): void {
		throw "DEPRECATED";
		// Add the client to list of active clients
		this.clients.push(client);

		// TODO: Generic: expose a hook or something? (the ship was created and added to the world here)

		// TODO: Generic: create+bind the client controller to some entities if needed ?
		console.log("WARNING: missing JoinGame code");
		/*var controller = new ClientController(client, ship, ShipUserAction, this.world);
		client.setController(controller);

		ship.addComponent(controller);
		client.setControlledEntity(ship);*/

		this.updateSingleClient(client);
	}

	getClients(): Client[] {
		return this.clients;
	}

	onClientDisconnect(client: Client): void {
		var index = this.clients.indexOf(client);
		if (index == -1) {
			console.error("Unknown client disconnected");
		}
		this.clients.splice(index, 1);

		this.world.removeEntity(client.getControlledEntity());
	}

	getWorld(): World {
		return this.world;
	}

	startLoop(): void {
		var now = new Date().getTime();
		var tickDuration = 1000/this.tickRate;
		this.lastUpdate = now;

		// TODO: Generic: start subcomponent (eg: boardsSpawner.start was here)

		// Update now
		now = new Date().getTime();
		this.lastUpdate = now;
		console.log("Starting mainloop @\t"+this.lastUpdate);
		this.firstTick = true;
		this.mainLoop();
		this.firstTick = false;

		// TODO: improve this
		// setup ping
		setInterval(() => {
			this.measureClientsPing();
		}, this.pingFrequency);
	}

	private mainLoop(): void {
		var log = false;
		if (log) console.log("======");
		var tickDuration = 1000 / this.tickRate;
		var now = this.lastUpdate + tickDuration;

		var delta = now - this.lastUpdate;
		if (log) console.log("Delta: ", delta, " Time:\t"+now,"  lastUpdt:\t"+this.lastUpdate);

		this.world.tick(delta, now);

		// TODO: Generic: tick subcomponents (eg: boardsSpawner.tick(delta, now) was here)

		this.updatePublicTimers(delta, now);

		this.updateClients(now);

		// DEBUG: print entities position
		this.world.getEntities().forEach((ent: Entity) => {
			var comp = ent.getComponentOrNull(GenericComponents.Movement);
			if (!comp) return;
			console.log("Entity " + ent.getGUID()+" @ ", comp.getPosition());
		});


		// Prepare next call
		//
		var realNow = new Date().getTime();	// update now

		var nextTickTime = this.lastUpdate + tickDuration;
		var loopLag = realNow - nextTickTime;
		var loopAdvance = -loopLag;
		if (log) console.log("Loop lag:", loopLag);
		// Cap the delay to prevent negative values
		var nextTickDelay = Math.max(0, loopAdvance);
		//var nextTickDelay = Math.max(0, nextTickTime - realNow);

		var tickMissLimit = 2;
		if (! this.firstTick && loopLag >= tickDuration*tickMissLimit ) {
			console.log("WARNING: CAN'T KEEP IT UP! Missed more than "+tickMissLimit+" full ticks. (lag: "+loopLag+", now: "+now+", tickDuration: "+tickDuration+")");
			console.log("DETAILS: realNow:", realNow, "\tlastUpdt:", this.lastUpdate);
			//throw new Error("I dieded");
		}

		if (log) console.log("Next tick in "+nextTickDelay+ "\t(@ time: "+nextTickTime+")");
		this.lastUpdate += tickDuration;
		console.log("Next Tick delay: ", nextTickDelay);
		setTimeout(() => {
			this.mainLoop();
		}, nextTickDelay);
	}

	private updatePublicTimers(delta: number, now: number): void {
		var newTimers: Timer[] = [];
		for (var i = 0; i < this.publicTimers.length; i++) {
			var timer = this.publicTimers[i];
			timer.tick(delta, now);
			if (! timer.isFinished()) newTimers.push(timer);
		}
		this.publicTimers = newTimers;
	}

	private updateClients(now: number): void {
		var serverState = {
			serverTime: now,
			world: this.world.flushState()
		};

		for (var i = 0; i < this.clients.length; ++i) {
			var c = this.clients[i];
			c.sendServerState(serverState);
		}
	}

	private updateSingleClient(c: Client): void {
		var state = {
			serverTime: <number> null,
			world: this.world.getState()
		};
		c.sendServerState(state);
	}

	private measureClientsPing(): void {
		for (var i = 0; i < this.clients.length; ++i) {
			var c = this.clients[i];
			c.updatePing();
		}
	}

	// TODO: Generic: do a LeaderBoardComponent that can be added to World as a component (not the GameServer as the
	// GameServer may run different World (= Levels).
}
