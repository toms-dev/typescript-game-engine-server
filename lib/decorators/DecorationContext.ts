
import Entity from "../Entity";
import IComponent from "../components/IComponent";
import Map from "../Map";

export default class DecorationContext {

	private static isStarted: boolean = false;
	static instance: DecorationContext = null;

	public entitiesClasses: (new (...args:any[]) => Entity)[];
	public componentsClasses: (new (...args:any[]) => IComponent)[];
	public mapsClasses: (new (...args:any[]) => Map)[];
	public startMapClass: new (...args:any[]) => Map;

	constructor() {
		this.entitiesClasses = [];
		this.componentsClasses = [];
		this.mapsClasses = [];
		this.startMapClass = null;
	}

	public static start(): void {
		if (this.isStarted) {	// make the loader fool-proof
			throw new Error("DecorationContext already started.");
		}
		console.log("DecorationContext listener is active!");
		this.instance = new DecorationContext();
		this.isStarted = true;
	}

	/**
	 * Stores the results of the class loading and reset the context for another use.
	 * @returns {DecorationContext}
	 */
	public static build(): DecorationContext {
		DecorationContext.instance.finalize();
		this.isStarted = false;
		return DecorationContext.instance;
	}

	public finalize(): void {
		if (this.mapsClasses.length != 0) {
			this.startMapClass = this.mapsClasses[0];
		}
	}

	public resolveEntity(className: string): new (...args: any[]) => Entity {
		var matching = this.entitiesClasses.filter((entityClass: any) => {
			return entityClass.name == className;
		});
		if (matching.length == 0) {
			return null
		}
		if (matching.length == 1) {
			return matching[0];
		}
		throw new Error("Found "+matching.length+" matching classes for name: '"+className+"'");
	}

}
