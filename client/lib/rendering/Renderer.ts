
import World from "../World";
import Drawable from "../components/common/Drawable";
import Camera from "./Camera";
import Vector3 from "../math/Vector3";
export default class Renderer {

	private $canvas: JQuery;
	private canvas: HTMLCanvasElement;
	private context: CanvasRenderingContext2D;

	private camera: Camera;
	private world: World;

	private lerp_duration: number = 100;

	constructor($canvas: JQuery, world: World) {
		this.$canvas = $canvas;
		this.canvas =  <HTMLCanvasElement> $canvas.get(0);
		this.context = this.canvas.getContext('2d');

		this.camera = new Camera(this, Vector3.create(0,0,0));
		this.world = world;
	}

	public getCamera(): Camera {
		return this.camera;
	}

	public render(): void {

		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

		var entities = this.world.getEntities();
		for (var i = 0; i < entities.length; ++i) {
			var ent = entities[i];
			var drawable = ent.getComponent(Drawable);
			if (drawable) {
				drawable.draw(this.camera, this.context);
			}
		}
	}

	getWidth():number {
		return this.canvas.width;
	}

	getHeight(): number {
		return this.canvas.height;
	}
}