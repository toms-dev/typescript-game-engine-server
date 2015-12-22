
import Entity from "./Entity";

abstract class Map {

	public entities: Entity[];

	constructor() {
		this.entities = [];
	}

	abstract setup(): void ;

}

export default Map;