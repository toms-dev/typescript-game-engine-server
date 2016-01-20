export enum InputAction {
	UP, DOWN, LEFT, RIGHT
}

enum Key {
	UP = 38,
	DOWN = 40,
	LEFT = 37,
	RIGHT = 39,
	Q = 81,
	D = 68,
	S = 83,
	Z = 90
}

var mapping: {[raw: string]: InputAction} = {
	Q: InputAction.LEFT,
	D: InputAction.RIGHT,
	Z: InputAction.UP,
	S: InputAction.DOWN,
	UP: InputAction.UP,
	DOWN: InputAction.DOWN,
	LEFT: InputAction.LEFT,
	RIGHT: InputAction.RIGHT
};

declare var $: any;

// TODO: have the keyboard convert the raw input (the keyboard) into abstracted notions
// it works for now because it is only UP/DOWN/LEFT/RIGHT but it will fail if custom keys
// can be assigned.

export default class Keyboard {

	private downKeys: InputAction[];

	constructor() {
		this.downKeys = [];
	}

	mapToInputAction(keyCode: number): InputAction {
		var keyName: string = Key[keyCode];
		console.log("Keyname:", keyName);
		if (!mapping.hasOwnProperty(keyName)) {
			return null;
		}
		var inputAction = mapping[keyName];
		console.log("Key:" + keyName + " mapped to action "+InputAction[inputAction]+" !");
		return inputAction;
	}

	setup() {
		var $target = $(document);
		$target.on('keydown', (event: KeyboardEvent) => {
			var keyCode = event.which;
			console.log("Which: ", keyCode);
			var actionName: InputAction = this.mapToInputAction(keyCode);

			// Skip unknown keys
			if (actionName == null) return;
			if (this.downKeys.indexOf(actionName) != -1) return;
			this.downKeys.push(actionName);

			//console.log("Down keys:", this.downKeys);

			event.preventDefault();
		});

		$target.on('keyup', (event: KeyboardEvent) => {
			var keyCode = event.which;
			var action: InputAction = this.mapToInputAction(keyCode);

			if (action == null) return;
			var indexOf = this.downKeys.indexOf(action);
			if (indexOf == -1) return;
			this.downKeys.splice(indexOf, 1);
			console.log("Down keys:", this.downKeys);
		});
	}

	getState(): any {
		return {
			downKeys: this.downKeys
		}
	}
}