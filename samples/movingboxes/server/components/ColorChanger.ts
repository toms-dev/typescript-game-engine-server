
import IComponent from "../../../../lib/components/IComponent";
import ColoredComponent from "./ColoredComponent";
import Component from "../../../../lib/components/Component";

/**
 * This server-side components makes a colored component change color on user input.
 */
export default class ColorChanger extends Component {

	public target: ColoredComponent;

	constructor(target: ColoredComponent) {
		super();
		this.target = target;
	}

	switchColor(): void {
		if (this.target.colorName == "red") {
			this.target.colorName = "blue";
		} else {
			this.target.colorName = "red";
		}
	}

	tick(delta:number, now:number):void {
		this.switchColor();
	}

}
