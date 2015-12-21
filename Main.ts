// <reference path="./TSGameEngine-typings.d.ts" />

/// <reference path="./typings/tsd.d.ts" />


require('reflect-metadata');

import {Entity} from "./index";
import Greenhouse from "./samples/narcos/entities/Greenhouse";
import GameServer from "./lib/GameServer";
import MyBox from "./samples/movingboxes/entities/MyBox";


var gameServer = new GameServer();
gameServer.startLoop();

var box = new MyBox("red");

gameServer.getWorld().addEntity(box);

console.log("State:", gameServer.getWorld().getState());