
import Entity from "./Entity";

abstract class Map {

	public entities: Entity[];

	abstract setup(): void ;

}

export default Map;