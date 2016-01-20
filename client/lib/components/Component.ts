
import IComponent from "./IComponent";
import ComponentBag from "./ComponentBag";

abstract class Component implements IComponent {

	abstract tick(delta:number, now:number):void;

	public parent: ComponentBag;

	constructor() {
		this.parent = null;
	}

	loadState():any {
		throw "not implemented!";
	}

}

export default Component;