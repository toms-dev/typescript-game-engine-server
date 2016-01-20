import IComponent from "./components/IComponent";
export default class Entity {

	public guid: number;
	protected components:IComponent[];
	private debugRawData: any;

	constructor(guid: number = 0) {
		this.guid = guid;
		this.components = [];
	}

	tick(delta:number, now: number) {
		for (var i = 0; i < this.components.length; ++i) {
			var comp = this.components[i];
			comp.tick(delta, now);
		}
	}

	getComponent<T>(constructor: new(...args: any[]) => T): T {
		for (var i in this.components) {
			if (! this.components.hasOwnProperty(i)) continue;
			var c: any = this.components[i];
			if (c instanceof constructor) {
				return c;
			}
		}
		return null;
	}

	hasComponent(constructor:new (...args: any[]) => IComponent): boolean {
		return this.getComponent(constructor) != null;
	}

	addComponent(component:IComponent):void {
		this.components.push(component);
	}

	loadState(entityData:any):void {
		this.guid = entityData.guid;

		this.debugRawData = entityData;

		for (var i = 0; i < this.components.length; ++i) {
			var comp = this.components[i];
			comp.loadState(entityData);
		}
	}

}