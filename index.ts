
//import Entity from "./lib/Entity";

import * as Components from "./lib/components/";
import * as Declare from "./lib/decorators/";
import * as Math from "./lib/math/";

import Entity from "./lib/Entity";
import Map from "./lib/Map";

import Main from "./Main";

// Hack to load typings when used in a lib ;) (as references are not allowed in index file)
import Definitions from "./lib/_definitions";
Definitions;

export {
	Components, Declare, Math,
	Entity, Map,
Main
};
