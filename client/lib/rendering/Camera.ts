
import Vector3 from "../math/Vector3";
import Renderer from "./Renderer";
export default class Camera {

	private renderer: Renderer;

	private position: Vector3;

	private width: number;
	private height: number;

	/**
	 * Number of pixels for 1 meter
	 */
	private scale: number;

	constructor(renderer: Renderer, position: Vector3) {
		this.renderer = renderer;

		this.width = this.renderer.getWidth();
		this.height = this.renderer.getHeight();
		console.log("Height = ", this.height);

		this.scale = 10;
	}

	worldPositionToPixelPosition(position: Vector3): Vector3 {
		var v = new Vector3(position.multiplyScalar(this.scale));
		v.y = this.height - v.y;
		return v;
	}

	pixelPositionToWorldPosition(coords:Vector3): Vector3 {
		var v = new Vector3(coords);
		v.y = this.height - coords.y;

		return v.multiplyScalar(1/this.scale);
	}

	getScale(): number {
		return this.scale;
	}
}
