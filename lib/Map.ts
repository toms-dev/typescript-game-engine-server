
import Entity from "./Entity";

/**
 * A map is a World configuration in which entities can be spawned on setup.
 */
abstract class Map {

	public entities: Entity[];

	constructor() {
		this.entities = [];
	}

	abstract setup(): void ;

}

export default Map;