
import ComponentBag from "./ComponentBag";
interface IComponent {

	tick(delta: number, now: number): void;

	getState(): any;

}


export default IComponent;

