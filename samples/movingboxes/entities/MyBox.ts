

import {Declare} from "../../../index";
import {Entity} from "../../../index";
import {Components} from "../../../index";
import ColoredComponent from "../components/ColoredComponent";
import ColorChanger from "../components/ColorChanger";

@Declare.Entity
export default class MyBox extends Entity {

	@Declare.Property
	public derp = "lol";

	constructor(boxColor:string) {
		super(null, null);
		var colorComponent = new ColoredComponent(boxColor);
		this.addComponent(colorComponent);
		this.addComponent(new ColorChanger(colorComponent));
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
