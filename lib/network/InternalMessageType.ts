
import MessageType from "./MessageType";
import InternalMessageTypeValue from "./InternalMessageTypeValue";
export default class InternalMessageType extends MessageType {

	constructor(enumValue: InternalMessageTypeValue) {
		super("internal_"+InternalMessageTypeValue[enumValue]);
	}
}
