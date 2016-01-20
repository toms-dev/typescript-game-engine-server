
import IComponent from "./IComponent";
import Component from "./Component";

export default class ComponentBag {

	protected components: IComponent[];

	constructor() {
		this.components = [];
	}

	public addComponent(component: IComponent):void {
		// TODO: clean existing code to remove this condition
		if (component instanceof Component) {
			// Link the parent of the component
			(<Component> component).parent = this;
		}
		this.components.push(component);
	}

	tick(delta: number, now: number) {
		for (var i = 0; i < this.components.length; ++i) {
			var comp = this.components[i];
			comp.tick(delta, now);
		}
	}

	loadState(cState: any): void {
		// Add data from components
		for (var i = 0; i < this.components.length; ++i) {
			this.components[i].loadState(cState);
			for (var prop in cState) {
				if (! cState.hasOwnProperty(prop)) continue;
				this[prop] = cState[prop];
			}
		}
	}

	// TODO: this code was imported from server. check if it has to be cleaned
	/*getState(): any {
		var state: any = {};

		// Add data from components
		for (var i = 0; i < this.components.length; ++i) {
			var cState = this.components[i].getState();
			for (var prop in cState) {
				if (! cState.hasOwnProperty(prop)) continue;
				state[prop] = cState[prop];
			}
		}
		return state;
	}*/

	getComponentsMatching<T>(constructor: new(...args: any[]) => T): T[] {
		return <any> this.components.filter((component:IComponent, i:number, arr:IComponent[]) => {
			return component instanceof constructor;
		});
	}

	/**
	 * Returning null can be a way to perform different logic but it should always be explicit to prevent null pointer
	 * exceptions.
	 * @param constructor The component constructor.
	 * @returns {T}
	 */
	getComponentOrNull<T>(constructor: new(...args: any[]) => T): T{
		var comps = this.getComponentsMatching(constructor);
		if (comps.length == 0) return null;
		return comps[0];
	}

	getComponent<T>(constructor: new(...args: any[]) => T): T {
		var c = this.getComponentOrNull(constructor);
		if (c == null) {
			throw new Error("No component "+(<any>constructor).name+" found in "+this+".");
		}
		return c;
	}

	hasComponent<T>(constructor: new(...args: any[]) => T): boolean {
		return this.getComponentOrNull(constructor) != null;
	}

}
