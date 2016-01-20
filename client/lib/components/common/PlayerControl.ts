
import IComponent from "./../IComponent";
export default class PlayerControlled implements IComponent {

	private focused: boolean;

	constructor() {
		this.focused = false;
	}

	focus(): void {
		this.focused = true;
	}

	unfocus(): void {
		this.focused = false;
	}

	isFocused(): boolean {
		return this.focused;
	}

	loadState(entityData:any):void {
	}

	tick(delta:number):void {
	}
}