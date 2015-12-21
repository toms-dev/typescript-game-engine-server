
import IComponent from "./IComponent";
import loadPropertiesValues from "../utils/PropertyLoader";

abstract class Component implements IComponent {

	abstract tick(delta:number, now:number):void;

	getState():any {
		var state = {};
		loadPropertiesValues(this, state);
		return state;
	}

}

export default Component;