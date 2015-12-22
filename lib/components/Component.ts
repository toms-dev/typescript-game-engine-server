
import IComponent from "./IComponent";
import loadPropertiesValues from "../utils/PropertyLoader";
import ComponentBag from "./ComponentBag";

abstract class Component implements IComponent {

	abstract tick(delta:number, now:number):void;

	public parent: ComponentBag;

	constructor() {
		this.parent = null;
	}

	getState():any {
		var state = {};
		loadPropertiesValues(this, state);
		return state;
	}

}

export default Component;