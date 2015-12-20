
import Plantation from "./Plantation";
import * as TSGameEngine from "../../../index";

function EngineDeclareEntityClass(constructor: any):any {
	console.log("Declaring class", constructor.name);
}

@EngineDeclareEntityClass
export default class Greenhouse extends TSGameEngine.Entity {

	public plantation: Plantation;

	public method(): void {

	}

}
