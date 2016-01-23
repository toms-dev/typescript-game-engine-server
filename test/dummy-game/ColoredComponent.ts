import {Declare, Components} from "../../index";

import IComponent = Components.IComponent;
import Component = Components.Component;
import ComponentBag = Components.ComponentBag;

@Declare.Component
export default class ColoredComponent extends Component {

	@Declare.Property
	public colorName:string;

	constructor(colorName:string) {
		super();
		this.colorName = colorName;
	}

	tick(delta:number, now:number):void {
	}

}
