

import {Declare} from "../../../../index";
import {Entity} from "../../../../index";
import {Components} from "../../../../index";
import ColoredComponent from "../components/ColoredComponent";
import ColorChanger from "../components/ColorChanger";
import Vector3 from "../../../../lib/math/Vector3";
import PathComponent from "../components/PathComponent";

@Declare.Entity
export default class MyBox extends Entity {

	@Declare.Property
	public derp = "lol";

	constructor(boxColor:string) {
		super(null, null);
		var colorComponent = new ColoredComponent(boxColor);
		this.addComponent(colorComponent);
		var movement = new Components.Generic.Movement();
		movement.setPosition(Vector3.create(Math.random()*3, Math.random()*3,0));
		this.addComponent(movement);
		this.addComponent(new PathComponent(movement));
		//this.addComponent(new ColorChanger(colorComponent));

		//console.warn("Making box "+this+" move!");
		//this.getComponent(Components.Generic.Movement).moveTo(Vector3.create(1,1,1));
	}

	public setup() {
		//this.addComponent(new Components.Generic.Movement()); // this component is both used on server and client sides
		this.addComponent(new Components.Generic.Drawable("box")); // this is mainly a client-side component
	}

	//@Declare.Entity.Property
	public someMethod(): number {
		return 42;
	}

}
