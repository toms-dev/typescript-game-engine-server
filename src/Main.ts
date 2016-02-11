// TODO: move this require somewhere else?
require('reflect-metadata');

import GameServer from "./lib/GameServer";
import Entity from "./lib/Entity";

export default function Main(configurationPath: string, tickRate = 25): GameServer {
	var gameServer = new GameServer();
	gameServer.startWebSocketServer();
	gameServer.loadProject(configurationPath);
	gameServer.tickRate = tickRate;
	//gameServer.loadProject("../samples/movingboxes/server/maps/MainMap");
	//gameServer.loadProject("test/dummy-game/EmptyMap");

	gameServer.startLoop();
	return gameServer;
}