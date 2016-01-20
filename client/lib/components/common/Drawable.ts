import IComponent from "./../IComponent";
import Renderer from "../../rendering/Renderer";
import Entity from "../../Entity";
import Movement from "./Movement";
import Camera from "../../rendering/Camera";

export default class Drawable implements IComponent {

	private spriteName:string;
	private entity: Entity;

	private drawingSize: number;
	private color: string;
	private image: HTMLImageElement;

	public constructor(entity: Entity, spriteName:string, size: number = 20) {
		this.entity = entity;
		this.spriteName = spriteName;
		this.loadSprite();

		this.drawingSize = size;
		this.color = this.getRandomColor();
	}

	loadState(entityData:any):void {
		// Optional override from server
		if (entityData.spriteName) {
			this.spriteName = entityData.spriteName;
			this.loadSprite();
		}
	}

	private loadSprite() {
		if (! this.spriteName) {
			throw new Error("Warning: empty image!");
		}
		this.image = new Image();
		this.image.src = "img/"+this.spriteName+".png";
	}

	tick(delta:number):void {
	}

	draw(camera: Camera, context: CanvasRenderingContext2D): void {
		var movement: Movement = this.entity.getComponent(Movement);

		if (! movement) return;

		var pos = movement.getPosition();
		var pxPos = camera.worldPositionToPixelPosition(pos);

		var drawX = pxPos.x - this.drawingSize/2;
		var drawY = pxPos.y - this.drawingSize/2;

		/*context.fillStyle = this.color;
		context.fillRect(drawX, drawY, 10, this.drawingHeight);*/
		context.drawImage(this.image, drawX, drawY, this.drawingSize, this.drawingSize);
		context.fillRect(pxPos.x, pxPos.y, 2, 2);
	}

	getRandomColor() {
		var letters = '0123456789ABCDEF'.split('');
		var color = '#';
		for (var i = 0; i < 6; i++ ) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}
}
