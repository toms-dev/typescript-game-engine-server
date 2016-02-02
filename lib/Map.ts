
import Entity from "./Entity";
import World from "./World";

/**
 * A map is a World configuration in which entities can be spawned on setup.
 */
abstract class Map {

	abstract setup(world: World): void ;

}

export default Map;