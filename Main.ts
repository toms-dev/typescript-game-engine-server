// <reference path="./TSGameEngine-typings.d.ts" />

/// <reference path="./typings/tsd.d.ts" />

import {Entity} from "./index";
import {Lol} from "./index";
import Greenhouse from "./samples/narcos/entities/Greenhouse";
import GameServer from "./lib/GameServer";


var gameServer = new GameServer();
gameServer.startLoop();

