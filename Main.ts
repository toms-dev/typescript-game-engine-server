
require('reflect-metadata');

//import {Entity} from 'typescript-game-engine';

import {Entity} from "./index";
import GameServer from "./lib/GameServer";

var gameServer = new GameServer();
gameServer.startWebSocketServer();
gameServer.loadProject("../samples/movingboxes/server/maps/MainMap");
//gameServer.loadProject("test/dummy-game/EmptyMap");
gameServer.startLoop();

