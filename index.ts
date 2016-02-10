//import Entity from "./lib/Entity";

import * as Components from "./lib/components/index";
import * as Declare from "./lib/decorators/index";
import * as Math from "./lib/math/index";

import Entity from "./lib/Entity";
import NamedEntityType from "./lib/NamedEntityType";

import World from "./lib/World";
import Map from "./lib/Map";

import Controller from "./lib/controllers/Controller";
import {CommandRequestJSON} from "./lib/commands/Command";
import IGameConfiguration from "./lib/IGameConfiguration";

import DecorationContext from "./lib/decorators/DecorationContext";

import Main from "./Main";

// Hack to load typings when used in a lib ;) (as references are not allowed in index file)
/*import Definitions from "./lib/_definitions";
Definitions;*/

export {
	Components, Declare, Math,
	Entity, NamedEntityType,
	World, Map,
	Controller, CommandRequestJSON,
	Main, IGameConfiguration,

	// Shared parts
	DecorationContext

};
