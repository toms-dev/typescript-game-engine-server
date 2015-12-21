
import Entity from "../Entity";
import Vector3 from "../math/Vector3";

import {CommandResponseJSON} from "../commands/Command";

import IComponent from "./IComponent";

interface IUserAction extends IComponent {

	onPrimaryEntity(target: Entity): void;
	onPrimaryPosition(position: Vector3): void;
	doCommand(commandID: number, commandName: string, params: any): CommandResponseJSON;

}

export default IUserAction;
