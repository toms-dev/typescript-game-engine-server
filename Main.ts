// TODO: move this require somewhere else?
require('reflect-metadata');

import GameServer from "./lib/GameServer";

export default function Main(path: string, tickRate = 25): GameServer {
	var gameServer = new GameServer();
	gameServer.startWebSocketServer();
	gameServer.loadProject(path);
	gameServer.tickRate = tickRate;
	//gameServer.loadProject("../samples/movingboxes/server/maps/MainMap");
	//gameServer.loadProject("test/dummy-game/EmptyMap");
	gameServer.startLoop();
	return gameServer;
}