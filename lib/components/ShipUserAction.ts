import IUserAction from "./IUserAction";
import Entity, {EntityType} from "../Entity";
import Vector3 from "../math/Vector3";
import Shooter from "./Shooter";

import CommandHandler from "../commands/CommandHandler";
import CommandType from "../commands/CommandType";
import {ICommandResponse} from "../commands/Command";

// Commands content
import UpgradeShipCommand from "../commands/UpgradeShipCommand";
import RepairShipCommand from "../commands/RepairShipCommand";
import UpgradeCannonCommand from "../commands/UpgradeCannonCommand";

export default class ShipUserAction implements IUserAction {
	private entity:Entity;
	private entityShoot:Shooter;
	private commandHandler: CommandHandler;

	constructor(entity:Entity) {
		this.entity = entity;
		this.entityShoot = entity.getComponent(Shooter);

		this.commandHandler = new CommandHandler();
		this.commandHandler.addCommand(new RepairShipCommand(this.entity));
		this.commandHandler.addCommand(new UpgradeShipCommand(this.entity));
		this.commandHandler.addCommand(new UpgradeCannonCommand(this.entity));
	}

	onPrimaryEntity(target:Entity):void {
		console.log(EntityType[this.entity.getType()]+"#"+this.entity.getGUID()+" primary action!");
		this.entityShoot.shoot(target);
	}

	onPrimaryPosition(position:Vector3):void {
		this.entityShoot.shootToPosition(position);
	}

	tick(delta:number):void {
	}

	getState():any {
		return undefined;
	}

	doCommand(commandID: number, commandName: string, params:any): ICommandResponse {
		return this.commandHandler.execute(commandID, commandName, params);
	}

}
