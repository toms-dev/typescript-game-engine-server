import Camera from "../rendering/Camera";
import World from "../World";
import Entity from "../Entity";
import Vector3, {RawCoords} from "../math/Vector3";
import Targetable from "../components/generic/Targetable";
declare var $:any;

export default class Mouse {

	private camera:Camera;
	private world:World;

	private actionType:string;
	private targetEntity:Entity;
	private targetPosition:Vector3;

	constructor(world:World) {
		this.world = world;
	}

	setup(canvas:any, camera:Camera):void {
		this.camera = camera;

		var $canvas = $(canvas);
		$canvas.on("mousedown", (event:MouseEvent) => {
			var coords = this.getRelativeClickCoordinates(event, $canvas);
			this.onClick(coords, "primary");
			event.preventDefault();
		});
		$canvas.on("contextmenu", (event:MouseEvent) => {
			var coords = this.getRelativeClickCoordinates(event, $canvas);
			this.onClick(coords, "secondary");
			event.preventDefault();
		})
	}

	private getRelativeClickCoordinates(event:MouseEvent, $canvas:JQuery):any {
		var canvasX = $canvas.offset().left,
			canvasY = $canvas.offset().top;
		console.log("Canvas position:", $canvas.position());
		console.log("Canvas offset:", $canvas.offset());
		var x = event.pageX - canvasX,
			y = event.pageY - canvasY;
		return {
			x: x,
			y: y
		}
	}

	private onClick(coords:{x:number, y:number,z:number}, type:string):void {
		console.log("Click " + type + " @ ", coords);
		coords.z = 0;
		var worldCoords = this.camera.pixelPositionToWorldPosition(Vector3.fromJSON(coords));

		// Resolve the coords to an entity
		var closest = this.world.getClosestEntityNear(worldCoords, function (ent:Entity) {
			return ent.hasComponent(Targetable);
		});
		var pixelDistance = closest.distance * this.camera.getScale();

		// Only snap to entity (if any) if close enough
		if (closest.entity && pixelDistance < 20) {
			console.log("Click on entity ", closest.entity);
			this.targetEntity = closest.entity;
		}
		else {
			console.log("Click on position", worldCoords);
			this.targetPosition = worldCoords;
		}

		this.actionType = type;

		console.log("Debug:", this.getState());
	}

	public clearState():void {
		this.actionType = null;
		this.targetEntity = null;
		this.targetPosition = null;
	}

	public getState():any {
		return {
			type: this.actionType,
			targetEntityID: this.targetEntity ? this.targetEntity.guid : null,
			targetPosition: this.targetPosition ? this.targetPosition.toJSON() : null
		};
	}
}
