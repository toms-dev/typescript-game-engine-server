import Entity from "./Entity";
import Controller from "./controllers/Controller";

interface IGameConfiguration<RootEntityType extends Entity> {
	createRootEntity(): RootEntityType;
	createRootController(rootEntity: RootEntityType): Controller;
}

export default IGameConfiguration;
