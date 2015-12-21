

import {Declare} from "../../../index";
import {Entity} from "../../../index";
import {Components} from "../../../index";

@Declare.Entity.Class
export default class MyBox extends Entity {

	@Declare.Entity.Property
	public boxColor: string;

	constructor(boxColor:string) {
		super(null, null);
		this.boxColor = boxColor;
	}

	public setup() {
		this.addComponent(new Components.Generic.Movement()); // this component is both used on server and client sides
		this.addComponent(new Components.Generic.Drawable("box")); // this is mainly a client-side component
	}

	//@Declare.Entity.Property
	public someMethod(): number {
		return 42;
	}

}
