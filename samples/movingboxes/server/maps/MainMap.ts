
import {Declare} from "../../../../index";
import Map from "../../../../lib/Map";
import MyBox from "../entities/MyBox";

@Declare.Map
export default class MainMap extends Map {

	setup():void {
		this.entities.push(new MyBox("red"));
		this.entities.push(new MyBox("blue"));
	}

}
