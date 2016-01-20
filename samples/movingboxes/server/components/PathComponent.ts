
import {Declare} from "../../../../index";
import IComponent from "../../../../lib/components/IComponent";
import Component from "../../../../lib/components/Component";
import ComponentBag from "../../../../lib/components/ComponentBag";
import Vector3 from "../../../../lib/math/Vector3";
import Movement from "../../../../lib/components/generic/Movement";


@Declare.Component
export default class PathComponent extends Component {

	private activeTarget: number;
	private targets: Vector3[];
	private movement: Movement;

	constructor(target: Movement) {
		super();
		this.targets = [
			Vector3.create(0, 0, 0),
			Vector3.create(3*Math.random(), 3*Math.random(), 0),
			Vector3.create(3*Math.random(), 3*Math.random(), 0),
			Vector3.create(3*Math.random(), 3*Math.random(), 0)
		];
		this.activeTarget = 0;
		this.movement = target;
	}

	tick(delta:number, now:number):void {
		if (!this.movement.hasTarget()) {
			var nextTargetIndex = this.activeTarget++ % this.targets.length;
			this.movement.moveTo(this.targets[nextTargetIndex]);
		}
	}

}