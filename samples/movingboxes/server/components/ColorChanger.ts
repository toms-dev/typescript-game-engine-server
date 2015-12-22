
import {Declare} from "../../../../index";
import IComponent from "../../../../lib/components/IComponent";
import ColoredComponent from "./ColoredComponent";
import Component from "../../../../lib/components/Component";
import Entity from "../../../../lib/Entity";
import ComponentBag from "../../../../lib/components/ComponentBag";

/**
 * This server-side components makes a colored component change color on user input.
 */
@Declare.Component
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
		console.log("New color for "+this.parent+" = "+this.target.colorName);
	}

	tick(delta:number, now:number):void {
		this.switchColor();
	}

}
