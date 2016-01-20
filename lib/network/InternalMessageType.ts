
import MessageType from "./MessageType";
import InternalMessageTypeValue from "./InternalMessageTypeValue";
export default class InternalMessageType extends MessageType {

	constructor(value: string) {
		super(value);
		//super("internal_"+InternalMessageTypeValue[enumValue]);
	}
}
