import IComponent from "../../../lib/components/IComponent";
/**
 * Created by Tom on 21/12/2015.
 */

import {Declare} from "../../../index";
import Component from "../../../lib/components/Component";

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