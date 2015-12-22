
import {Declare} from "../../../../index";
import IComponent from "../../../../lib/components/IComponent";
import Component from "../../../../lib/components/Component";
import ComponentBag from "../../../../lib/components/ComponentBag";

@Declare.Component
export default class ColoredComponent extends Component {

	@Declare.Property
	public colorName: string;

	constructor(colorName:string) {
		super();
		this.colorName = colorName;
	}

	tick(delta:number, now:number):void {
	}

}